import jwt from 'jsonwebtoken';
import UserModel from '../models/users';

import configs from '../config';

const {
  jwtSecret,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
} = configs[process.env.NODE_ENV];

export default {
  generateAuthTokens: async (id, userAgent) => {
    const data = await UserModel.getUser(id);
    const accessToken = jwt.sign(data, jwtSecret, { expiresIn: accessTokenExpiresIn });
    const refreshToken = jwt.sign(data, jwtSecret, { expiresIn: refreshTokenExpiresIn });
    const expireAt = new Date(jwt.verify(refreshToken, jwtSecret).exp * 1000);
    await UserModel.upsertUserToken(
      { id, type: 'refreshToken', userAgent },
      { id, type: 'refreshToken', expireAt, token: refreshToken, userAgent },
    );
    return { accessToken, refreshToken, refreshTokenExpireAt: expireAt };
  },

//   generateCode: async () => {
//     const token = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
//     const expireAt = new Date(new Date().setSeconds(new Date().getSeconds() + 900));
//     await db.Tokens.upsertUserToken(
//       { username, type }, { username, type, expireAt, token }, system, true,
//     );
//     return { code: token, codeExpireAt: expireAt };
//   },
};
