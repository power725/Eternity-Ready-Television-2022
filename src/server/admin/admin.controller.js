import _ from 'lodash';
import express from 'express';
import jwt from 'jwt-simple';
import passport from 'passport';
import util from 'util';

import Channel from '../channel/channel.model';
import config from '../config';
import User from '../user/user.model';
import uuidV4 from 'uuid/v4';
import {
	getHashPassword
} from '../user/user.helpers';
import {
	sendValidationEmail,
	sendForgotPasswordEmail
} from '../email';

var router = express.Router();

function isAdmin(req, res, next) {
	if (!req.user || !req.user.isAdmin || req.user.suspended || !req.user.validated) {
		return res.status(401).send();
	}
	next();
}

function getChannels() {
	return Channel.find({}).sort({
		_id: -1
	}).populate('categories');
}

function createUser(user) {

	user.username = user.email;
	user.createdDate = new Date();
	user.isAdmin = false;

	user.validated = false;
	user.validationToken = uuidV4();

	user.suspended = false;

	user.auth = {
		provider: 'email'
	};

	var newUser = new User(user);

	return newUser.save();
}

function listUsers() {
	return User.find({})
}

function authenticate(data) {

	var user, token;

	return User.findOne({
			username: data.email
		})
		.then((response) => {

			if (!response) {
				throw new Error('Email not found in our database.');
			}

			if (!response.validated) {
				throw new Error('This email address is not validated. Please check your inbox.')
			}

			if (!response.isAdmin) {
				throw new Error('You don\'t have admin permissions')
			}


			if (response.suspended) {
				throw new Error('This email address is suspended')
			}

			user = response;
			return user.comparePassword(data.password);
		})
		.then((isMatch) => {

			if (isMatch) {

				token = 'JWT ' + jwt.encode({
					_id: user._id
				}, config.JWT_SECRET_KEY);

				return {
					token,
					user: {
						_id: user._id,
						name: user.name,
						email: user.email,
						username: user.username,
						auth: user.auth
					}
				};
			}

			throw new Error('Incorrect password.');
		});
}

function updateUser(_id, $set) {
	return User.findOneAndUpdate({
		_id: _id
	}, {
		$set: $set
	});
}

router.post('/update-user', passport.authenticate('jwt', {
	session: false
}), isAdmin, function(req, res) {
	req.checkBody('id', 'Please provide a valid `id`').notEmpty();


	req.getValidationResult().then(function(result) {
			if (!result.isEmpty()) {
				throw new Error(result.array()[0].msg);
			}

			const id = req.body.id;
			const $set = _.pick(req.body, ['isAdmin', 'validated', 'suspended']);

			if ($set.admin &&
				typeof $set.admin !== 'boolean') {

				throw new Error('`admin` should be boolean')

			}

			return updateUser(id, $set);
		})
		.then(response => res.json(Object.assign({
			success: true
		}, response)))
		.catch((error) => {
			res.json({
				success: false,
				error: {
					message: error.message
				}
			})
		});
});


router.get('/list', passport.authenticate('jwt', {
	session: false
}), isAdmin, function(req, res) {

	listUsers()
		.then(response => res.json({
			success: true,
			users: response
		}))
		.catch((error) => {
			res.json({
				success: false,
				error: {
					message: error.message
				}
			})
		});
});

router.post('/authenticate', function(req, res) {

	console.log(req.body);

	req.checkBody('email', 'Please provide a valid `email`').notEmpty();
	req.checkBody('password', 'Please provide a valid `password`').notEmpty();

	req.getValidationResult().then(function(result) {
			if (!result.isEmpty()) {
				throw new Error(result.array()[0].msg);
			}

			return authenticate({
				email: req.body.email,
				password: req.body.password
			});
		})
		.then(response => {
			res.json(Object.assign({
				success: true
			}, response));
		})
		.catch((error) => {
			res.json({
				success: false,
				message: error.message
			});
		});
});


router.post('/change-password', passport.authenticate('jwt', {
	session: false
}), isAdmin, passport.authenticate('jwt', {
	session: false
}), (req, res) => {
	req.checkBody('password', 'Please provide a valid `password.`').notEmpty();
	req.checkBody('userId', 'Please provide a valid `userId.`').notEmpty();

	req.getValidationResult().then(function(result) {
			if (!result.isEmpty()) {
				throw new Error(result.array()[0].msg);
			}

			return getHashPassword(req.body.password)
				.then((hashedPassword) => {
					return User.findOneAndUpdate({
						_id: req.body.userId
					}, {
						$set: {
							password: hashedPassword
						}
					});
				})
				.then((user) => {
					if (!user) {
						throw new Error('The email address was not found in our database.')
					}

					return user;
				})
		})
		.then(() => {
			res.json({
				success: true,
				message: 'The password was successfully updated.'
			});
		})
		.catch((error) => {
			res.json({
				success: false,
				message: error.message
			});
		});
});

router.post('/create-user', passport.authenticate('jwt', {
	session: false
}), isAdmin, function(req, res) {

	req.checkBody('email', 'Please provide a valid `email`').notEmpty();
	req.checkBody('password', 'Please provide a valid `password`').notEmpty();

	req.getValidationResult().then(function(result) {
			if (!result.isEmpty()) {
				throw new Error(result.array()[0].msg);
			}

			return createUser(_.pick(req.body, ['email', 'password']));
		})
		.then(response => {
			sendValidationEmail({
				email: response.email,
				validationToken: response.validationToken
			}, () => {});

			res.json({
				success: true,
				message: 'Account created. An activation email was send'
			});
		})
		.catch((error) => {
			let message = error.message;
			console.log(error.code);
			if (error.code == 11000) {
				message = 'This email address is already registered.'
			}

			res.json({
				success: false,
				message
			})
		});
});

router.get('/delete', passport.authenticate('jwt', {
	session: false
}), isAdmin, function(req, res) {

	var id = req.query.id;

	req.checkQuery('id', 'Please provide a valid `id`').notEmpty();

	req.getValidationResult()
		.then(function(result) {

			if (!result.isEmpty()) {
				throw new Error(result.array()[0].msg);
			}

			return User.remove({
				_id: req.query.id
			});
		})
		.then(restaurant => res.json(Object.assign({
			success: true,
			message: 'The account was successfully deleted.'
		})))
		.catch((error) => {
			res.json({
				success: false,
				error: {
					message: error.message
				}
			});
		});
});

router.get('/get-channels', function(req, res) {

	getChannels(req.query.query)
		.then(response => res.json({
			success: true,
			channels: response
		}))
		.catch((error) => {
			res.json({
				success: false,
				message: error.message
			});
		});
});

export default router;