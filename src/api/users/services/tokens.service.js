import jwt from 'jsonwebtoken';
import tokensRepository from '../repositories/tokens.repository';

import config from '../../../config';

const {
  jwtSecret,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
} = config;

async function generateAuthTokens(user, userAgent) {
  const accessToken = jwt.sign({ user, type: 'access-token' }, jwtSecret, { expiresIn: accessTokenExpiresIn });
  const refreshToken = jwt.sign({ user, type: 'refresh-token' }, jwtSecret, { expiresIn: refreshTokenExpiresIn });
  const expireAt = new Date(jwt.verify(refreshToken, jwtSecret).exp * 1000);
  await tokensRepository.setToken({ userId: user.id, expireAt, refreshToken, userAgent });
  return { accessToken, refreshToken };
}

async function deleteUserRefreshToken(userId, userAgent) {
  return tokensRepository.deleteToken({ userId, userAgent });
}

async function decodeUserRefreshToken(token) {
  try {
    const decodedToken = jwt.verify(token, jwtSecret);
    if (decodedToken.type === 'refresh-token') {
      return decodedToken.user;
    }
    return {};
  } catch (e) {
    return {};
  }
}
async function decodeUserAccessToken(token) {
  try {
    const decodedToken = jwt.verify(token, jwtSecret);
    if (decodedToken.type === 'access-token') {
      return decodedToken.user;
    }
    return {};
  } catch (e) {
    return {};
  }
}

export default {
  decodeUserAccessToken,
  decodeUserRefreshToken,
  generateAuthTokens,
  deleteUserRefreshToken,
};
