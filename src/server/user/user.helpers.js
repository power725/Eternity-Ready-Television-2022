var bcrypt   = require('bcrypt-nodejs');

export function getHashPassword (password, cb) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        cb && cb(err);
        return reject(err);
      }

      bcrypt.hash(password, salt, null, function (err, hash) {
        if (err) {
          cb && cb(err);
          return reject(err);
        }

        resolve(hash);
        cb && cb(null, hash);
      });
    });
  });
};