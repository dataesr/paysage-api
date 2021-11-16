import nodemailer from 'nodemailer';
import config from '../config';

const transport = config.mailer;
const mailer = nodemailer.createTransport(transport);

async function sendActivationCode(email, username, code, codeExpireAt) {
  return mailer.sendMail({
    subject: 'Comfirmez votre inscription à Paysage',
    text: `Bienvenue ${username}. Comfirmez votre inscription avec le code 
           ${code} (valable jusqu'à ${codeExpireAt.toTimeString()})`,
    from: 'Paysage <contact@dataesr.ovh>',
    to: email,
  });
}

async function sendPasswordRenewalCode(email, username, code, codeExpireAt) {
  return mailer.sendMail({
    subject: 'Réinitialiser le mot de passe',
    text: `Bonjour ${username}. Vous pouvez changer votre mot de passe grâce au code suivant: 
           ${code} (valable jusqu'à ${codeExpireAt.toTimeString()})`,
    from: 'Paysage <contact@dataesr.ovh>',
    to: email,
  });
}

export default {
  sendActivationCode,
  sendPasswordRenewalCode,
};
