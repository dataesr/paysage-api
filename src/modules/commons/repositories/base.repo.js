import db from '../services/database.service';

const globalPipeline = [
  {
    $lookup: {
      from: 'users',
      localField: 'createdBy',
      foreignField: 'id',
      as: 'user',
    },
  },
  { $set: { user: { $arrayElemAt: ['$user', 0] } } },
  { $set: { createdBy: { id: '$user.id', username: '$user.username', avatar: '$user.avatar' } } },
  {
    $lookup: {
      from: 'users',
      localField: 'updatedBy',
      foreignField: 'id',
      as: 'user',
    },
  },
  { $set: { user: { $arrayElemAt: ['$user', 0] } } },
  { $set: { updatedBy: { id: '$user.id', username: '$user.username', avatar: '$user.avatar' } } },
  { $project: { _id: 0, user: 0 } },
];

const generateId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let id = '';
  for (let i = 0; i < 6; i += 1) {
    id += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  for (let i = 0; i < 2; i += 1) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

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
const parseReturnFieldsParams = (returnFields) => {
  if (!Array.isArray(returnFields)) { throw new Error('returnFields must be an array of strings'); }
  returnFields.forEach((returnField) => {
    if (!(typeof returnField === 'string' && Object.prototype.toString.call(returnField) === '[object String]')) {
      throw new Error('returnFields must be an array of strings');
    }
  });
  return returnFields.reduce((doc, field) => ({ ...doc, [field]: 1 }), {});
};

export default class BaseRepo {
  constructor({ collection, pipeline = [] }) {
    if (!collection) { throw new Error('collection must be specified'); }
    if (!(typeof collection === 'string' && Object.prototype.toString.call(collection) === '[object String]')) {
      throw new Error('collection must be a string');
    }
    this._db = db;
    this._catalogue = this._db.collection('catalogue');
    this._collection = this._db.collection(collection);
    this._pipeline = pipeline;
    this._parseReturnFieldsParams = parseReturnFieldsParams;
    this._parseSortParams = parseSortParams;
    this._globalPipeline = globalPipeline;
  }

  async _getUniqueId() {
    let id;
    for (let retries = 0; retries < 100; retries += 1) {
      id = generateId();
      // eslint-disable-next-line no-await-in-loop
      const exists = await this._catalogue.findOne({ id });
      if (!exists) { break; }
    }
    const { result } = await this._catalogue.insertOne({ id });
    if (result.ok) { return id; }
    throw new Error('Too many retries ...');
  }

  async find(filters = {}, { skip = 0, limit = 20, sort = null, returnFields = null } = {}) {
    const countPipeline = [{ $match: filters }, { $count: 'totalCount' }];
    const queryPipeline = [
      { $match: filters },
      { $skip: skip },
      { $limit: limit },
      ...this._globalPipeline,
      ...this._pipeline,
    ];
    if (sort) { queryPipeline.push({ $sort: this._parseSortParams(sort) }); }
    if (returnFields) { queryPipeline.push({ $project: this._parseReturnFieldsParams(returnFields) }); }
    const data = await this._collection.aggregate([
      { $facet: { data: queryPipeline, total: countPipeline } },
      { $project: { data: 1, total: { $arrayElemAt: ['$total', 0] } } },
      { $project: { data: 1, totalCount: '$total.totalCount' } },
    ]).toArray();
    return data[0];
  }

  async findById(id, { returnFields = null } = {}) {
    const { data } = await this.find({ id }, { limit: 1, returnFields });
    return data ? data[0] : null;
  }

  async insert(data) {
    const id = await this._getUniqueId();
    await this._collection.insertOne(
      { ...data, id, createdAt: new Date(), updatedAt: new Date() },
    );
    return id;
  }

  async updateById(id, data) {
    const { modifiedCount } = await this._collection.updateOne({ id }, { $set: data });
    return { ok: !!modifiedCount };
  }

  async deleteById(id) {
    const { deletedCount } = await this._collection.deleteOne({ id });
    return { ok: !!deletedCount };
  }

  async exists(id) {
    return { ok: !!await this._collection.findOne({ id }) };
  }
}
