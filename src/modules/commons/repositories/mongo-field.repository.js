import db from '../../../services/mongo.service';

export const parseSortParams = (sort) => {
  try {
    return sort.split(',').reduce((doc, field) => {
      if (field.startsWith('-')) { return ({ ...doc, [field.split('-')[1]]: -1 }); }
      return ({ ...doc, [field]: 1 });
    }, {});
  } catch (e) {
    throw new Error('sort must be a comma separated list of string');
  }
};

export default class MongoFieldRepository {
  constructor({ collection, field, models = [] }) {
    if (!field) { throw new Error("Parameter 'field' must be specified"); }
    if (!(typeof field === 'string' && Object.prototype.toString.call(field) === '[object String]')) {
      throw new Error("Parameter 'field' must be a string");
    }
    this._collection = db.collection(collection);
    this._field = field;
    this._models = models;
  }

  async find(rid, filters = {}, { skip = 0, limit = 20, sort = null, useModel = null } = {}) {
    if (!rid) { throw new Error("Parameter 'rid' must be specified"); }
    const _pipeline = [
      { $match: { id: rid } },
      { $unwind: { path: `$${this._field}` } },
      { $match: { [this._field]: { $exists: true, $not: { $type: 'array' }, $type: 'object' } } },
      { $replaceRoot: { newRoot: `$${this._field}` } },
      { $match: filters },
    ];
    const model = this._models[useModel] ?? [];
    const queryPipeline = [
      ..._pipeline,
      { $skip: skip || 0 },
      { $limit: limit || 20 },
      ...model,
    ];
    if (sort) queryPipeline.push({ $sort: parseSortParams(sort) });
    const countPipeline = [..._pipeline, { $count: 'totalCount' }];
    const data = await this._collection.aggregate([
      { $facet: { data: queryPipeline, total: countPipeline } },
      { $project: { data: 1, total: { $arrayElemAt: ['$total', 0] } } },
      { $project: { data: 1, totalCount: '$total.totalCount' } },
    ]).toArray();
    return data[0];
  }

  async get(rid, id, { useModel } = {}) {
    if (!rid) { throw new Error("Parameter 'rid' must be specified"); }
    const { data } = await this.find(rid, { id }, { limit: 1, useModel });
    return data ? data[0] : null;
  }

  async create(rid, data) {
    if (!rid) { throw new Error("Parameter 'rid' must be specified"); }
    const { modifiedCount } = await this._collection.updateOne(
      { id: rid, [this._field]: { $not: { $elemMatch: { id: data.id } } } },
      { $push: { [this._field]: data } },
    );
    return modifiedCount ? data.id : 0;
  }

  async patch(rid, id, data, { session = null } = {}) {
    if (!rid) { throw new Error("Parameter 'rid' must be specified"); }
    const pipe = [
      { $match: { id: rid } },
      { $unwind: { path: `$${this._field}` } },
      { $match: { [this._field]: { $exists: true, $not: { $type: 'array' }, $type: 'object' } } },
      { $replaceRoot: { newRoot: `$${this._field}` } },
      { $match: { id } },
    ];
    const currentData = await this._collection.aggregate(pipe, { session }).toArray();
    const _data = { ...currentData[0], ...data };
    const { modifiedCount } = await this._collection.updateOne(
      { id: rid, [`${this._field}.id`]: id },
      { $set: { [`${this._field}.$`]: _data } },
      { session },
    );
    return { ok: !!modifiedCount };
  }

  async remove(rid, id) {
    if (!rid) { throw new Error("Parameter 'rid' must be specified"); }
    const { modifiedCount } = await this._collection.updateOne(
      { id: rid },
      { $pull: { [this._field]: { id } } },
    );
    return { ok: !!modifiedCount };
  }
}
