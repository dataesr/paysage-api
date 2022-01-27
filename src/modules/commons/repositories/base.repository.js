import db from '../services/database.service';
import { parseSortParams } from '../helpers/parseParams';

export default class BaseRepo {
  constructor({ collection, models = {} }) {
    if (!collection) { throw new Error("Parameter 'collection' must be specified"); }
    if (!(typeof collection === 'string' && Object.prototype.toString.call(collection) === '[object String]')) {
      throw new Error("Parameter 'collection' must be a string");
    }
    this.collectionName = collection;
    this._collection = db.collection(collection);
    this._models = { ...models, default: [] };
  }

  async find({
    filters = {},
    skip = 0,
    limit = 20,
    sort = null,
    useModel = 'default',
  } = {}) {
    const countPipeline = [{ $match: filters }, { $count: 'totalCount' }];
    const queryPipeline = [
      { $match: filters },
      { $skip: skip },
      { $limit: limit },
      ...this._models[useModel],
    ];
    if (sort) { queryPipeline.push({ $sort: parseSortParams(sort) }); }
    const data = await this._collection.aggregate([
      { $facet: { data: queryPipeline, total: countPipeline } },
      { $project: { data: 1, total: { $arrayElemAt: ['$total', 0] } } },
      { $project: { data: 1, totalCount: '$total.totalCount' } },
    ]).toArray();
    return data[0];
  }

  async get(id, { useModel = 'default' } = {}) {
    const { data } = await this.find({ id }, { limit: 1, useModel });
    return data ? data[0] : null;
  }

  async create(data, { session = null } = {}) {
    await this._collection.insertOne(data, { session });
    return data.id;
  }

  async patch(id, data) {
    const { modifiedCount } = await this._collection.updateOne({ id }, { $set: data });
    return { ok: !!modifiedCount };
  }

  async remove(id) {
    const { deletedCount } = await this._collection.deleteOne({ id });
    return { ok: !!deletedCount };
  }

  async exists(id) {
    return !!await this._collection.findOne({ id });
  }
}
