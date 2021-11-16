import emitter from '../emitter';
import Users from '../models/users';

export default {
  getUser: async (id) => Users.findById(id),

  deleteUser: async (id) => {
    if (await Users.deleteById(id)) {
      emitter.emit('userDeleted', id);
      return true;
    }
    return false;
  },
};
