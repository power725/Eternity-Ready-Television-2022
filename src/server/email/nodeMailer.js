import nodemailer from 'nodemailer';
import config from '../config';
import * as templates from './templates';

const AUTH = {
  user: 'noreply.eternityready@gmail.com',
  pass: 'xxxxxx'
};

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: AUTH
});


export function sendForgotPasswordEmail ({email, forgotPasswordToken}, cb) {
  // setup email data with unicode symbols

  const mailOptions = templates.forgotEmail(AUTH.user, email, forgotPasswordToken);

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Message %s sent: %s', info.messageId, info.response);
    }

    cb();
  });
}

export function sendValidationEmail ({email, validationToken}, cb) {

  const mailOptions = templates.validationEmail(AUTH.user, email, validationToken);

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Message %s sent: %s', info.messageId, info.response);
    }

    cb();
  });
}
