import emitter from '../events';
import UserModel from '../models/users';

export default {
  getUser: async (id) => UserModel.getUser(id),

  deleteUser: async (id) => {
    if (await UserModel.deleteUser(id)) {
      emitter.emit('userDeleted', id);
      return true;
    }
    return false;
  },

};
