import nodemailer from 'nodemailer';
import config from '../config/app.config';

const transport = config.mailer;
const mailerService = nodemailer.createTransport(transport);
export default mailerService;
