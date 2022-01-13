import db, { client } from '../../commons/services/database.service';
import { getUniqueId } from '../../commons/services/ids.service';
import { NotFoundError } from '../../commons/errors';

const parseSortParams = (sort) => {
  try {
    return sort.split(',').reduce((doc, field) => {
      if (field.startsWith('-')) { return ({ ...doc, [field.split('-')[1]]: -1 }); }
      return ({ ...doc, [field]: 1 });
    }, {});
  } catch (e) {
    throw new Error('sort must be a comma separated list of string');
  }
};

export default {
  list: async (filters, options) => {
    const { fields, sort, ...opts } = options;
    if (fields) opts.projection = fields.reduce((doc, field) => ({ ...doc, [field]: 1 }), {});
    if (sort) opts.sort = parseSortParams(sort);
    const data = await db.collection('categories-view').find(filters, opts).toArray();
    const totalCount = await db.collection('categories-view').countDocuments(filters);
    return { data, totalCount };
  },

  delete: async (id) => {
    const session = client.startSession();
    const prevState = await db.collection('categories').findOne({ id });
    if (!prevState) throw new NotFoundError();
    const { result } = await session.withTransaction(async () => {
      await db.collection('categories').deleteOne({ id }, { session });
      await db.collection('event-store').insertOne({
        userId: null,
        timestamp: '$$NOW',
        action: 'delete',
        resourceId: id,
        resourceType: 'category',
        prevState,
        nextState: null,
      }, { session });
    });
    console.log(result.ok);
    session.endSession();
    return id;
  },

  read: async (id, fields = []) => {
    const data = await db.collection('categories-view').findOne(
      { id }, { projection: fields.reduce((doc, field) => ({ ...doc, [field]: 1 }), {}) },
    );
    if (!data) throw new NotFoundError();
    return data;
  },

  update: async (id, data) => {
    const session = client.startSession();
    const prevState = await db.collection('categories').findOne({ id });
    if (!prevState) throw new NotFoundError();
    const { result } = await session.withTransaction(async () => {
      await db.collection('categories').updateOne({ id }, { $set: data }, { session });
      const nextState = await db.collection('categories').findOne({ id }, { session });
      await db.collection('event-store').insertOne({
        userId: data.updatedBy,
        timestamp: data.updatedAt,
        action: 'update',
        resourceId: id,
        resourceType: 'category',
        prevState,
        nextState,
      }, { session });
    });
    session.endSession();
    return db.collection('categories-view').findOne({ id });
  },

  create: async (data) => {
    const session = client.startSession();
    const id = await getUniqueId();
    const _data = { ...data, id };
    const { result } = await session.withTransaction(async () => {
      const { insertedId } = await db.collection('categories').insertOne(_data, { session });
      await db.collection('event-store').insertOne({
        userId: data.updatedBy,
        timestamp: data.updatedAt,
        action: 'create',
        resourceId: id,
        resourceType: 'category',
        prevState: null,
        nextState: _data,
      }, { session });
    });
    session.endSession();
    return db.collection('categories-view').findOne({ id });
  },
};
