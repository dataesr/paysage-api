import db from '../utils/mongo-connexion';
import { addInsertMeta } from './utils/metas';

export default {
  // Users ----------------------
  addUser: async (data, actor) => {
    const _data = await addInsertMeta(data, actor);
    await db.collection('users').insertOne(_data);
    return _data.id; // renvoi de l'id sur création
  },

  getUser: async (id) => db.collection('users').findOne({ id }, { projection: { password: 0, _id: 0 } }),

  deleteUser: async (id) => db.collection('users').deleteOne({ id }).deletedCount === 1,

  // Tokens ---------------------
  upsertUserToken: async (filters = {}, data = {}) => {
    db.collection('tokens')
      .updateOne(filters, { $set: data }, { upsert: true })
      .catch((e) => { throw new Error(e); });
  },
};
