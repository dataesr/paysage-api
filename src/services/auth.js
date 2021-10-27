import bcrypt from 'bcryptjs';
import emitter from '../events';
import UserModel from '../models/users';
import TokenService from './tokens';

export default {
  signup: async (data, userAgent) => {
    const _data = {
      ...data,
      password: await bcrypt.hash(data.password, 10),
      role: 'user',
      active: false,
    };
    const id = await UserModel.addUser(_data, data.username);
    const { accessToken, refreshToken } = await TokenService.generateAuthTokens(id, userAgent);
    emitter.emit('userCreated');
    emitter.emit('logger');
    return { accessToken, refreshToken };
  },
};
