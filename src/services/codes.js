import emitter from '../emitter';
import Users from '../models/users';

import config from '../config';

const { codesExpiresIn } = config;

function generateCode() {
  const code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
  const expireAt = new Date(new Date().setSeconds(new Date().getSeconds() + codesExpiresIn));
  return { code, expireAt };
}

async function generateActivationCode(user) {
  const { code, expireAt } = generateCode();
  await Users.setCode({ userId: user.id, type: 'activation', expireAt, code });
  emitter.emit('activationCodeCreated', { user, activationInfo: { code, expireAt } });
}

async function generatePasswordRenewalCode(user) {
  const { code, expireAt } = generateCode();
  await Users.setCode({ userId: user.id, type: 'password-renewal', expireAt, code });
  emitter.emit('passwordRenewalCodeCreated', { user, passwordRenewalInfo: { code, expireAt } });
}

export default { generateActivationCode, generatePasswordRenewalCode };
