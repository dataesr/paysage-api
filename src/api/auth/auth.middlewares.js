import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticator, totp } from 'otplib';

import agenda from '../../jobs';
import config from '../../config';
import { usersRepository, tokensRepository } from '../commons/repositories';
import userTokenQuery from '../commons/queries/users.token.query';
import {
  BadRequestError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
} from '../commons/http-errors';

const {
  defaultAccountConfirmation,
  jwtSecret,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
  otpHeader,
  otpMethodHeader,
} = config;

export const signup = async (req, res, next) => {
  const { body, context } = req;
  const password = await bcrypt.hash(body.password, 10);
  const otpSecret = authenticator.generateSecret();
  const userData = {
    ...body,
    ...context,
    confirmed: defaultAccountConfirmation,
    createdAt: new Date(),
    createdBy: context.id,
    isOtpRequired: true,
    otpSecret,
    password,
    role: 'user',
  };
  const exists = await usersRepository.getByEmail(body.email);
  if (exists) throw new BadRequestError('Un compte existe déja');
  const id = await usersRepository.create(userData);
  if (!id) throw new ServerError();
  agenda.now('send welcome email', { user: { id: userData.id, ...body } });
  res.status(201).json({ message: 'Compte crée.' });
  return next();
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const userAgent = req.headers['user-agent'];
  const userOtp = req.headers[otpHeader];
  const otpMethod = req.headers[otpMethodHeader];
  const user = await usersRepository.getByEmail(email);
  if (!user) throw new BadRequestError('Utilisateur inconnu');
  if (!user.confirmed) {
    throw new UnauthorizedError(
      `Votre compte est en attente de validation par un administrateur.
      Un email vous sera envoyé lorsque vous pourrez vous connecter`,
    );
  }
  if (user.isDeleted) throw new UnauthorizedError('Compte désactivé');
  const { password: _password } = user;
  const isMatch = await bcrypt.compare(password, _password);
  if (!isMatch) throw new BadRequestError('Mauvaise combinaison utilisateur/mot de passe');
  totp.options = { window: [60, 0] };
  if (user.isOtpRequired && !userOtp) {
    res.setHeader(otpHeader, 'required');
    res.setHeader(otpMethodHeader, 'email;');
    if (otpMethod === 'email') {
      const otp = totp.generate(user.otpSecret);
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      agenda.now('send signin email', { user, otp, ip });
      const expires = new Date().setMinutes(new Date().getMinutes() + 15);
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      res.status(202).json({
        message: `Un nouveau code a été envoyé à l'adresse ${user.email}.
         Code utilisable jusqu'au ${new Date(expires).toLocaleString('fr-FR', options)}`,
      });
      return next();
    }
  }
  if (user.isOtpRequired && !totp.check(userOtp, user.otpSecret)) throw new UnauthorizedError('Code invalide');
  if (user.isOtpRequired) {
    await usersRepository.setOtpRequired(user.id, false);
  }
  const userForToken = await usersRepository.getByEmail(email, { useQuery: userTokenQuery });
  const { isOtpRequired, ...tokenUser } = userForToken;
  const accessToken = jwt.sign({ user: tokenUser }, jwtSecret, { expiresIn: accessTokenExpiresIn });
  const refreshToken = jwt.sign({ user: tokenUser }, jwtSecret, { expiresIn: refreshTokenExpiresIn });
  const expireAt = new Date(jwt.verify(refreshToken, jwtSecret).exp * 1000);
  await tokensRepository.upsert(
    { userId: user.id, userAgent },
    { userId: user.id, userAgent, refreshToken, expireAt },
  );
  res.status(200).json({ accessToken, refreshToken });
  return next();
};

export const signout = async (req, res, next) => {
  const { currentUser, userAgent } = req;
  await tokensRepository.remove({ userId: currentUser.id, userAgent });
  res.status(204).json({ message: 'Vous êtes déconnecté.' });
  return next();
};

export const refreshAccessToken = async (req, res) => {
  const userAgent = req.headers['user-agent'];
  const { body } = req;
  const { refreshToken: token } = body;
  jwt.verify(token, jwtSecret, (err) => {
    if (err) throw new UnauthorizedError('Token invalide');
  });
  const savedToken = await tokensRepository.get({ userAgent, refreshToken: token });
  if (!savedToken?.userId) throw new UnauthorizedError('Token invalide');
  const { userId } = savedToken;
  const user = await usersRepository.get(userId, { useQuery: userTokenQuery });
  const { isOtpRequired, ...tokenUser } = user;
  if (isOtpRequired) throw new UnauthorizedError('La verification du compte est requise. Reconnectez-vous');
  const accessToken = jwt.sign({ user: tokenUser }, jwtSecret, { expiresIn: accessTokenExpiresIn });
  const refreshToken = jwt.sign({ user: tokenUser }, jwtSecret, { expiresIn: refreshTokenExpiresIn });
  const expireAt = new Date(jwt.verify(refreshToken, jwtSecret).exp * 1000);
  await tokensRepository.upsert(
    { userId, userAgent },
    { userId, userAgent, refreshToken, expireAt },
  );
  res.status(200).json({ accessToken, refreshToken });
};

export const resetPassword = async (req, res, next) => {
  if (req.currentUser.id) {
    throw new BadRequestError(
      'Vous êtes déja connecté. Utilisez le changement de mot de passe dans les paramêtres de votre compte',
    );
  }
  const { password, email } = req.body;
  const userOtp = req.headers[otpHeader];
  const otpMethod = req.headers[otpMethodHeader];
  const user = await usersRepository.getByEmail(email);
  if (!user) throw new NotFoundError();
  totp.options = { window: [60, 0] };
  if (!userOtp) {
    res.setHeader(otpHeader, 'required');
    res.setHeader(otpMethodHeader, 'email;');
    if (otpMethod === 'email') {
      const otp = totp.generate(user.otpSecret);
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      agenda.now('send recovery email', { user, otp, ip });
      const expires = new Date().setMinutes(new Date().getMinutes() + 15);
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      res.status(202).json({
        message: `Un nouveau code a été envoyé à l'adresse ${user.email}.
         Code utilisable jusqu'au ${new Date(expires).toLocaleString('fr-FR', options)}`,
      });
      return next();
    }
  }
  if (!totp.check(userOtp, user.otpSecret)) throw new UnauthorizedError('Code invalide');
  if (!password) throw new BadRequestError('Un nouveau mot de passe est requis.');
  const _password = await bcrypt.hash(password, 10);
  await usersRepository.setPassword(user.id, _password);
  res.status(200).json({ message: 'Mot de passe modifié. Vous pouvez vous connecter.' });
  return next();
};
