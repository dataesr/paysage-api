import db from '../services/database.service';
import { parseSortParams, parseReturnFieldsParams } from '../helpers/parseParams';

export default class BaseRepo {
  constructor({ collection, pipeline = [] }) {
    if (!collection) { throw new Error("Parameter 'collection' must be specified"); }
    if (!(typeof collection === 'string' && Object.prototype.toString.call(collection) === '[object String]')) {
      throw new Error("Parameter 'collection' must be a string");
    }
    if (!Array.isArray(pipeline)) { throw new Error("Parameter 'pipeline' must be an array"); }
    this._collectionName = collection;
    this._collection = db.collection(collection);
    this._pipeline = pipeline;
  }

  async find(filters = {}, {
    skip = 0, limit = 20, sort = null, fields = null, session = null,
  } = {}) {
    const countPipeline = [{ $match: filters }, { $count: 'totalCount' }];
    const queryPipeline = [
      { $match: filters },
      { $skip: skip },
      { $limit: limit },
      ...this._pipeline,
    ];
    if (sort) { queryPipeline.push({ $sort: parseSortParams(sort) }); }
    if (fields) { queryPipeline.push({ $project: parseReturnFieldsParams(fields) }); }
    const data = await this._collection.aggregate([
      { $facet: { data: queryPipeline, total: countPipeline } },
      { $project: { data: 1, total: { $arrayElemAt: ['$total', 0] } } },
      { $project: { data: 1, totalCount: '$total.totalCount' } },
    ], { session }).toArray();
    return data[0];
  }

  async findById(id, { fields = null, session = null } = {}) {
    const { data } = await this.find({ id }, { limit: 1, fields, session });
    return data ? data[0] : null;
  }

  async getStateById(id, { session = null } = {}) {
    const data = await this._collection.findOne(
      { id },
      { projection: { _id: 0, id: 0, createdBy: 0, updatedBy: 0, updatedAt: 0, createdAt: 0 }, session },
    );
    return data || null;
  }

  async insert(data, { session = null } = {}) {
    await this._collection.insertOne({ ...data, createdAt: new Date() }, { session });
    return data.id;
  }

  async updateById(id, data, { session = null } = {}) {
    const { modifiedCount } = await this._collection.updateOne(
      { id },
      { $set: { ...data, updatedAt: new Date() } },
      { session },
    );
    return { ok: !!modifiedCount };
  }

  async deleteById(id, { session = null } = {}) {
    const { deletedCount } = await this._collection.deleteOne({ id }, { session });
    return { ok: !!deletedCount };
  }

  async exists(id, { session = null } = {}) {
    return !!await this._collection.findOne({ id }, { session });
  }
}
