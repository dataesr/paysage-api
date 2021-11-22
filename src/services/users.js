import emitter from '../emitter';
import Users from '../models/user.models';

export default {
  getUser: async (id) => {
    const u = await Users.findById(id);
    console.debug('==== getUser ==== ', u);
    return { u };
  },

  deleteUser: async (id) => {
    if (await Users.deleteById(id)) {
      emitter.emit('userDeleted', id);
      return true;
    }
    return false;
  },
};
