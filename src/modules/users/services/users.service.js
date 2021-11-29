import bcrypt from 'bcryptjs';
import emitter from '../../commons/services/emitter.service';
import usersRepository from '../repositories/users.repository';

export default {

  create: async (resource) => {
    // TODO:
    //    add email checks to set confirmed to false for
    //    external and 'decentralized' users
    const password = await bcrypt.hash(resource.password, 10);
    const confirmed = true;
    const user = {
      ...resource,
      role: resource.role || 'user',
      active: resource.active || false,
      confirmed,
      password,
      createdAt: new Date(),
    };
    const insertedUser = await usersRepository.insert(user);
    emitter.emit('userCreated', insertedUser);
    return insertedUser;
  },

  updateById: async (userId, resource) => {
    const user = await usersRepository.updateById(userId, resource);
    emitter.emit('userUpdated', user);
    return user;
  },

  deleteById: async (id) => {
    await usersRepository.deleteById(id);
    emitter.emit('userDeleted', id);
    return null;
  },

  list: async (params) => usersRepository.find(params),

  readById: async (id) => usersRepository.findById(id),

  activateAccount: async (id) => usersRepository.updateById(id, { active: true }),
  setAdminById: async (id) => usersRepository.updateById(id, { role: 'admin' }),

  getUserByAccount: async (account) => usersRepository.findByAccount(account),
  validateUserCredentials: async (account, password) => {
    const user = await usersRepository.findByAccountWithPassword(account);
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
  },

  changeUserPasswordById: async (id, password) => {
    const _password = await bcrypt.hash(password, 10);
    return usersRepository.updateById(id, { password: _password });
  },

};
