import config from '../config';
import * as nodeMailer from './nodeMailer';
import * as mailgun from './mailgun';

const provider = config.MAIL_PROVIDER === 'nodemailer' ? nodeMailer : mailgun;

export const sendForgotPasswordEmail = provider['sendForgotPasswordEmail'];
export const sendValidationEmail = provider['sendValidationEmail'];
