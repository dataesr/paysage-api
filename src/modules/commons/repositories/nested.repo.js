import db from '../services/database.service';
import { parseSortParams, parseReturnFieldsParams } from '../helpers/parseParams';

export default class NestedRepo {
  constructor({ collection, field, pipeline = [] }) {
    if (!field) { throw new Error("Parameter 'field' must be specified"); }
    if (!(typeof field === 'string' && Object.prototype.toString.call(field) === '[object String]')) {
      throw new Error("Parameter 'field' must be a string");
    }
    this._collection = db.collection(collection);
    this._field = field;
    this._pipeline = pipeline;
  }

  async _getUniqueId(resourceId) {
    const currentId = await this._collection.aggregate([
      { $match: { id: resourceId } },
      { $project: { id: { $max: `$${this._field}.id` } } },
    ]).toArray();
    if (currentId[0].id) { return currentId[0].id + 1; }
    return 1;
  }

  async find(resourceId, filters = {}, {
    skip = 0, limit = 20, sort = null, fields = null, session = null,
  } = {}) {
    if (!resourceId) { throw new Error("Parameter 'resourceId' must be specified"); }
    const _pipeline = [
      { $match: { id: resourceId } },
      { $unwind: { path: `$${this._field}` } },
      { $match: { [this._field]: { $exists: true, $not: { $type: 'array' }, $type: 'object' } } },
      { $replaceRoot: { newRoot: `$${this._field}` } },
      { $match: filters },
    ];
    const queryPipeline = [
      ..._pipeline,
      { $skip: skip || 0 },
      { $limit: limit || 20 },
      ...this._pipeline,
    ];
    if (fields) queryPipeline.push({ $project: parseReturnFieldsParams(fields) });
    if (sort) queryPipeline.push({ $sort: parseSortParams(sort) });
    const countPipeline = [..._pipeline, { $count: 'totalCount' }];
    const data = await this._collection.aggregate([
      { $facet: { data: queryPipeline, total: countPipeline } },
      { $project: { data: 1, total: { $arrayElemAt: ['$total', 0] } } },
      { $project: { data: 1, totalCount: '$total.totalCount' } },
    ], { session }).toArray();
    return data[0];
  }

  async getStateById(resourceId, id, { session = null } = {}) {
    if (!resourceId) { throw new Error("Parameter 'resourceId' must be specified"); }
    const data = await this._collection.aggregate([
      { $match: { id: resourceId } },
      { $unwind: { path: `$${this._field}` } },
      { $match: { [this._field]: { $exists: true, $not: { $type: 'array' }, $type: 'object' } } },
      { $replaceRoot: { newRoot: `$${this._field}` } },
      { $match: { id } },
      { $project: { _id: 0, id: 0, createdBy: 0, updatedBy: 0, createdAt: 0, updatedAt: 0 }},
    ], { session }).toArray();
    return data.length ? data[0] : null;
  }

  async findById(resourceId, id, { fields = null, session = null } = {}) {
    if (!resourceId) { throw new Error("Parameter 'resourceId' must be specified"); }
    const { data } = await this.find(resourceId, { id }, { limit: 1, fields, session });
    return data ? data[0] : null;
  }

  async insert(resourceId, data, { session = null } = {}) {
    if (!resourceId) { throw new Error("Parameter 'resourceId' must be specified"); }
    const id = await this._getUniqueId(resourceId);
    const _data = { ...data, id, createdAt: new Date() };
    const { modifiedCount } = await this._collection.updateOne(
      { id: resourceId, [this._field]: { $not: { $elemMatch: { id } } } },
      { $push: { [this._field]: _data } },
      { session },
    );
    return modifiedCount ? id : 0;
  }

  async updateById(resourceId, id, data, { session = null } = {}) {
    if (!resourceId) { throw new Error("Parameter 'resourceId' must be specified"); }
    const pipe = [
      { $match: { id: resourceId } },
      { $unwind: { path: `$${this._field}` } },
      { $match: { [this._field]: { $exists: true, $not: { $type: 'array' }, $type: 'object' } } },
      { $replaceRoot: { newRoot: `$${this._field}` } },
      { $match: { id } },
    ];
    const currentData = await this._collection.aggregate(pipe, { session }).toArray();
    const _data = { ...currentData[0], ...data, updatedAt: new Date() };
    const { modifiedCount } = await this._collection.updateOne(
      { id: resourceId, [`${this._field}.id`]: id },
      { $set: { [`${this._field}.$`]: _data } },
      { session },
    );
    return { ok: !!modifiedCount };
  }

  async deleteById(resourceId, id, { session = null } = {}) {
    if (!resourceId) { throw new Error("Parameter 'resourceId' must be specified"); }
    const { modifiedCount } = await this._collection.updateOne(
      { id: resourceId }, { $pull: { [this._field]: { id } } }, { session },
    );
    return { ok: !!modifiedCount };
  }
}
