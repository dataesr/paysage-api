import bcrypt from 'bcryptjs';
import emitter from '../emitter';
import Users from '../models/user.models';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { addInsertMeta, addUpdateMeta } from './utils/metas';

import config from '../config';

const { codesExpiresIn } = config;

function generateCode() {
  const code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
  const expireAt = new Date(new Date().setSeconds(new Date().getSeconds() + codesExpiresIn));
  return { code, expireAt };
}

async function signup(data) {
  const password = await bcrypt.hash(data.password, 10);
  // TODO:
  //    add email checks to set confirmed to false for
  //    external and 'decentralized' users
  const confirmed = true;
  const _data = addInsertMeta({ ...data, role: 'user', active: false, password, confirmed }, data.username);
  const user = await Users.insertOne(_data);
  emitter.emit('userSignedUp', { user });
  return user;
}

async function signin(account, password) {
  const savedPassword = await Users.getPasswordByAccount(account);
  if (!savedPassword) throw new BadRequestError('Mauvaise combinaison compte/mot de passe');
  const isMatch = await bcrypt.compare(password, savedPassword);
  if (!isMatch) throw new BadRequestError('Mauvaise combinaison compte/mot de passe');
  return Users.findByAccount(account);
}

async function activateAccount(userId, code) {
  const user = await Users.findById(userId);
  const verifiedCode = await Users.verifyCode({ userId, type: 'activation', code });
  if (!verifiedCode) throw new BadRequestError('Code invalide');
  return Users.updateById(userId, addUpdateMeta({ active: true }, user.username));
}

async function renewActivationCode(userId) {
  const user = await Users.findById(userId);
  const { code, expireAt } = generateCode();
  await Users.setCode({ userId, type: 'activation', expireAt, code });
  emitter.emit('activationCodeCreated', { user, activationInfo: { code, expireAt } });
  return user;
}

async function generatePasswordRenewalCode(account) {
  const user = await Users.findByAccount(account);
  if (!user) throw new NotFoundError('Compte inconnu');
  const { code, expireAt } = generateCode();
  await Users.setCode({ userId: user.id, type: 'password-renewal', expireAt, code });
  emitter.emit('passwordRenewalCodeCreated', { user, passwordRenewalInfo: { code, expireAt } });
  return user;
}

async function resetPassword(account, password, code) {
  const user = await Users.findByAccount(account);
  if (!user) throw new NotFoundError('Compte inconnu');
  const verifiedCode = await Users.verifyCode({ userId: user.id, type: 'password-renewal', code });
  if (!verifiedCode) throw new BadRequestError('Code invalide');
  const _password = await bcrypt.hash(password, 10);
  await Users.updateById(user.id, addUpdateMeta({ password: _password }, user.username));
  await Users.destroyCode({ userId: user.id, type: 'password-renewal', code });
  return true;
}

export default {
  signup,
  signin,
  activateAccount,
  renewActivationCode,
  generatePasswordRenewalCode,
  resetPassword,
};
