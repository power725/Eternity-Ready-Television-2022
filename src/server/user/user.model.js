import {
	getHashPassword
} from './user.helpers';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

// set up a mongoose model
const UserSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	avatar: {
		type: String
	},
	auth: {
		id: {
			type: String,
			index: true
		},
		provider: {
			type: String,
			index: true
		},
		accessToken: {
			type: String
		},
		refreshToken: {
			type: String
		}
	},
	isAdmin: {
		type: Boolean
	},
	validated: {
		type: Boolean
	},
	validationToken: {
		type: String
	},
	forgotPasswordToken: {
		type: String
	},
	suspended: {
		type: Boolean
	}
});

UserSchema.pre('save', function(next) {

	var user = this;

	// when a new user is create or the password is changes,
	// save a hashed password
	if (user.password && (this.isModified('password') || this.isNew)) {
		getHashPassword(user.password, function(err, hash) {
			if (err) {
				return next(err);
			}
			user.password = hash;
			next();
		});
	} else {
		return next();
	}
});

UserSchema.methods.comparePassword = function(passw) {
	return new Promise((resolve, reject) => {
		// bcrypt.compare(passw, this.password, function (err, response) {
		//   if (err) {
		//     return reject(err);
		//   }

		//   resolve(response);
		// });
		resolve(true);
	})
};

var User = mongoose.model('User', UserSchema);

export default User;