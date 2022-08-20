import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticator, totp } from 'otplib';
import agenda from '../../jobs/agenda';
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
    otpSecret,
    password,
    role: 'user',
  };
  const exists = await usersRepository.getByEmail(body.email);
  if (exists) throw new BadRequestError('Un compte existe déja');
  const id = await usersRepository.create(userData);
  if (!id) throw new ServerError();
  agenda.now('send welcome email', { user: { id: userData.id, ...body } });
  res.status(201).json({ message: 'Compte crée. Veuillez vous connecter.' });
  return next();
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const userOtp = req.headers[otpHeader];
  const otpMethod = req.headers[otpMethodHeader];
  const user = await usersRepository.getByEmail(email);
  if (!user) throw new BadRequestError('Utilisateur inconnu');
  if (!user.confirmed) {
    throw new UnauthorizedError(
      'Votre compte est en attente de validation par un administrateur. Un email vous sera envoyé lorsque vous pourrez vous connecter',
    );
  }
  if (user.banned) throw new UnauthorizedError('Compte désactivé');
  const { password: _password } = user;
  const isMatch = await bcrypt.compare(password, _password);
  if (!isMatch) throw new BadRequestError('Mauvaise combinaison utilisateur/mot de passe');
  totp.options = { window: [20, 0] };
  const reason = !userOtp
    ? 'Authentification double facteur requise'
    : 'Code invalide';
  if (!userOtp || !totp.check(userOtp, user.otpSecret)) {
    res.setHeader(otpHeader, 'required');
    res.setHeader(otpMethodHeader, 'email;');
    if (otpMethod === 'email') {
      const otp = totp.generate(user.otpSecret);
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      agenda.now('send signin email', { user, otp, ip });
      const expires = new Date().setMinutes(new Date().getMinutes + 10);
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      throw new UnauthorizedError(
        `${reason}.
         Un nouveau code à été envoyé à l'adresse ${user.email}.
         Code utilisable jusqu'au ${expires.toLocaleString('fr-FR', options)}`,
      );
    }
    throw new UnauthorizedError(reason);
  }
  const tokenUser = await usersRepository.getByEmail(email, { useQuery: userTokenQuery });
  const accessToken = jwt.sign({ user: tokenUser }, jwtSecret, { expiresIn: accessTokenExpiresIn });
  const refreshToken = jwt.sign({ user: tokenUser }, jwtSecret, { expiresIn: refreshTokenExpiresIn });
  const expireAt = new Date(jwt.verify(refreshToken, jwtSecret).exp * 1000);
  await tokensRepository.upsert(
    { userId: user.id, userAgent: req.userAgent },
    { userId: user.id, userAgent: req.userAgent, refreshToken, expireAt },
  );
  res.status(200).json({ accessToken, refreshToken });
  return next();
};

export const signout = async (req, res, next) => {
  const { currentUser, userAgent } = req;
  await tokensRepository.remove({ userId: currentUser.id, userAgent });
  res.status(204).json();
  return next();
};

export const refreshAccessToken = async (req, res) => {
  const { body, userAgent } = req;
  const { refreshToken: token } = body;
  jwt.verify(token, jwtSecret, (err) => {
    if (err) throw new UnauthorizedError('Token invalide');
  });
  const { userId } = await tokensRepository.get({ userAgent, refreshToken: token });
  if (!userId) throw new UnauthorizedError('Token invalide');
  const tokenUser = await usersRepository.get(userId, { useQuery: userTokenQuery });
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
  if (req.currentUser.id) throw new BadRequestError('You are already connected');
  const { password, email } = req.body;
  const userOtp = req.header[otpHeader];
  const otpMethod = req.headers[otpMethodHeader];
  const user = await usersRepository.getByEmail(email);
  if (!user) throw new NotFoundError();
  if (!userOtp || !totp.check(userOtp, user.otpSecret)) {
    res.setHeader(otpHeader, 'required');
    res.setHeader(otpMethodHeader, 'email;');
    if (otpMethod === 'email') {
      const otp = totp.generate(user.otpSecret);
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      agenda.now('send recovery email', { user, otp, ip });
      const expires = new Date().setMinutes(new Date().getMinutes + 10);
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      throw new UnauthorizedError(
        `Un nouveau code à été envoyé à l'adresse ${user.email}.
         Code utilisable jusqu'au ${expires.toLocaleString('fr-FR', options)}`,
      );
    }
    throw new UnauthorizedError('Code invalide');
  }
  if (!password) throw new BadRequestError('password required');
  const _password = await bcrypt.hash(password, 10);
  await usersRepository.patch(user.id, { password: _password });
  res.status(200).json({ message: 'Mot de passe modifié. Vous pouvez vous connecter.' });
  return next();
};
