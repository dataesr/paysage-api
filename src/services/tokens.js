import jwt from 'jsonwebtoken';
import Tokens from '../models/token.models';

import config from '../config';
import { BadRequestError } from '../utils/errors';

const {
  jwtSecret,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
} = config;

async function generateAuthTokens(user, userAgent) {
  const accessToken = jwt.sign({ user }, jwtSecret, { expiresIn: accessTokenExpiresIn });
  const refreshToken = jwt.sign({ user }, jwtSecret, { expiresIn: refreshTokenExpiresIn });
  const expireAt = new Date(jwt.verify(refreshToken, jwtSecret).exp * 1000);
  await Tokens.setToken({ userId: user.id, expireAt, refreshToken, userAgent });
  return { accessToken, refreshToken };
}

async function destroyAuthTokens(userId, userAgent) {
  return Tokens.destroyToken({ userId, userAgent });
}

async function refreshAccessToken(refreshToken, userAgent) {
  let user;
  try {
    const decodedToken = jwt.verify(refreshToken, jwtSecret);
    user = decodedToken.user;
  } catch (e) { throw new BadRequestError('Token invalide'); }
  const token = await Tokens.findToken({ userId: user.id, refreshToken, userAgent });
  if (!token) throw new BadRequestError('Token invalide');
  return generateAuthTokens(user, userAgent);
}

export default {
  generateAuthTokens,
  destroyAuthTokens,
  refreshAccessToken,
};
