import bcrypt from 'bcryptjs';
import emitter from '../events';
import UserModel from '../models/users';
import TokenService from './tokens';

export default {
  createUser: async (data, userAgent) => {
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

  getUser: async (id) => UserModel.getUser(id),

  deleteUser: async (id) => {
    if (await UserModel.deleteUser(id)) {
      emitter.emit('userDeleted', id);
      return true;
    }
    return false;
  },

};
