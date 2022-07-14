import util from 'util';
import _ from 'lodash';
import express from "express";
import passport from 'passport';
import jwt from 'jwt-simple';

import { sendValidationEmail, sendForgotPasswordEmail } from '../email';
import User from  "./user.model";
import config from '../config';
import { getHashPassword } from './user.helpers';
import uuidV4 from 'uuid/v4';

var router = express.Router();

function createUser(user) {
  user.username = user.email;
  user.createdDate = new Date();
  user.isAdmin = false;

  user.validated = false;
  user.validationToken = uuidV4();

  user.auth = {
    provider: 'email'
  };

  var newUser = new User(user);

  return newUser.save();
}

function listUsers() {
  return User.find({})
}

function authenticate (data) {

  var user, token;
  return User.findOne({ username: data.email })
    .then((response) => {
      if (!response) {
        throw new Error('Email not found in our database.');
      }

      if (!response.validated) {
        throw new Error('This email address is not validated. Please check your inbox.')
      }

      user = response;
      return user.comparePassword(data.password);
    })
    .then((isMatch) => {
      if (isMatch) {
        token = 'JWT ' + jwt.encode({_id: user._id}, config.JWT_SECRET_KEY);

        return {
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            auth: user.auth
          }
        }
      }

      throw new Error('Incorrect password.');
    })
}

function updateUser(_id, $set) {
  return User.findOneAndUpdate(
    { _id: _id },
    { $set: $set }
  )
}

function validateUser(validationToken) {

  return User.findOneAndUpdate(
    { validationToken },
    { $set: { validated: true } }
  ).then((response) => {

    if (!response) {
      throw new Error('Invalid link!')
    }

    return response;
  })
}

router.post('/signup', function (req, res) {

  req.checkBody('email',  'Please provide a valid `email`').notEmpty();
  req.checkBody('password',  'Please provide a valid `password`').notEmpty();

  req.getValidationResult().then(function(result) {
      if (!result.isEmpty()) {
        throw new Error(result.array()[0].msg);
      }

      return createUser(_.pick(req.body,
        ['email', 'password']
      ));
    })
    .then(response => {
      sendValidationEmail({
        email: response.email,
        validationToken: response.validationToken
      }, () => {});

      res.json({
        success: true,
        message: 'An activation email was send to your email address.'
      });
    })
    .catch((error) => {
      let message = error.message;
      console.log(error.code);
      if (error.code == 11000) {
        message = 'This email address is already registered.'
      }

      res.json({success: false, message })
    });
});

router.post('/update-user', function (req, res) {
  req.checkBody('id', 'Please provide a valid `id`').notEmpty();


  req.getValidationResult().then(function(result) {
      if (!result.isEmpty()) {
        throw new Error(result.array()[0].msg);
      }

      const id = req.body.id;
      const $set = _.pick(req.body, ['isAdmin']);

      if ($set.admin &&
        typeof $set.admin !== 'boolean') {

        throw new Error('`admin` should be boolean')

      }

      return updateUser(id, $set);
    })
    .then(response => res.json(Object.assign({success: true}, response)))
    .catch((error) => {
      res.json({success: false, error: {message: error.message}})
    });
});


router.get('/list', function (req, res) {

  listUsers()
    .then(response => res.json({success: true, users: response}))
    .catch((error) => {
      res.json({success: false, error: {message: error.message}})
    });
});

router.post('/authenticate', function (req, res) {

  console.log(req.body);

  req.checkBody('email', 'Please provide a valid `email`').notEmpty();
  req.checkBody('password',  'Please provide a valid `password`').notEmpty();

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
      res.json(Object.assign({success: true}, response));
    })
    .catch((error) => {
      res.json({success: false, message: error.message});
    });
});

router.get('/validate', (req, res) => {
  req.checkQuery('token', 'Please provide a valid `email`').notEmpty();

  validateUser(req.query.token)
    .then(() => res.redirect('/login'))
    .catch((error) => res.json({success: false, message: error.message}))
});

router.post('/send-forgot-password-email', (req, res) => {
  req.checkBody('email',  'Please provide a valid `email`').notEmpty();

  const forgotPasswordToken = uuidV4();
  User.findOneAndUpdate(
    {username: req.body.email},
    {$set: {forgotPasswordToken}}
    )
    .then((user) => {
      if (!user) {
        throw new Error('The email address was not found in our database.')
      }

      sendForgotPasswordEmail({email: req.body.email, forgotPasswordToken}, () => {});
      res.json({success: true, message: 'An email with reset password instructions was successfully sent.'});
    })
    .catch((error) => res.json({success: false, message: error.message}));
});

router.post('/change-password', passport.authenticate("jwt", { session: false }), (req, res) => {
  req.checkBody('password',  'Please provide a valid `password.`').notEmpty();

  req.getValidationResult().then(function(result) {
      if (!result.isEmpty()) {
        throw new Error(result.array()[0].msg);
      }

      return getHashPassword(req.body.password)
        .then((hashedPassword) => {
          return User.findOneAndUpdate(
            { _id: req.user._id },
            { $set: { password: hashedPassword } }
          );
        })
        .then((user) => {
          if (!user) {
            throw new Error('The email address was not found in our database.')
          }

          return user;
        })
    })
    .then(() => {
      res.json({success: true, message: 'The password was successfully updated.'});
    })
    .catch((error) => {
      res.json({success: false, message: error.message});
    });

});

router.post('/reset-password', (req, res) => {

  req.checkBody('password',  'Please provide a valid `password`').notEmpty();
  req.checkBody('token',  'Please provide a valid `token`').notEmpty();

  req.getValidationResult().then(function(result) {
      if (!result.isEmpty()) {
        throw new Error(result.array()[0].msg);
      }

      return getHashPassword(req.body.password)
        .then((hashedPassword) => {
          return User.findOneAndUpdate(
            { forgotPasswordToken: req.body.token },
            { $set: { password: hashedPassword } }
          );
        })
        .then((user) => {
          if (!user) {
            throw new Error('The email address was not found in our database.')
          }

          return user;
        })
    })
    .then(() => {
      res.json({success: true, message: 'The password was successfully updated.'});
    })
    .catch((error) => {
      res.json({success: false, message: error.message});
    });

});

export default router;