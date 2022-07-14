import config from '../config';

export function forgotEmail(fromEmail, email, forgotPasswordToken) {
  const url = `${config.WEPAPP_URI}/forgot-password/${forgotPasswordToken}`;
  const html = `
     Hi!<br>
     You recently requested to reset your password for your account.
     Click here to reset it: <br /><a href="${url}">${url}</a><br />
     If you did not request a password reset, please ignore this email `;

  const mailOptions = {
    from: fromEmail, // sender address
    to: email, // list of receivers
    subject: `Reset Password`, // Subject line
    html: html, // nodemailer
    text: html // mailgun
  };

  return mailOptions;
}

export function validationEmail(fromEmail, email, validationToken) {
  const url = `${config.WEPAPP_URI}/api/user/validate?token=${validationToken}`;
  const html = `
        Hi!<br/>
        Thanks for registering. To activate your email address click the link below!
        <br/><br/>
        Activation Link: <a href='${url}'>${url}</a> `;

  const mailOptions = {
    from: fromEmail, // sender address
    to: email, // list of receivers
    subject: `Registration`, // Subject line
    html: html, // nodemailer
    text: html // mailgun
  };

  return mailOptions;
}