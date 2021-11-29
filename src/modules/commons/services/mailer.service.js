import nodemailer from 'nodemailer';
import config from '../../../config/app.config';

const transport = config.mailer;
export default nodemailer.createTransport(transport);
