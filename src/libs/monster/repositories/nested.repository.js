import parseSortParams from './helpers';

export default class NestedMongoRepository {
  constructor({ db, collection, field, queries = {} }) {
    if (!field) { throw new Error("Parameter 'field' must be specified"); }
    if (!(typeof field === 'string' && Object.prototype.toString.call(field) === '[object String]')) {
      throw new Error("Parameter 'field' must be a string");
    }
    this._collection = db.collection(collection);
    this._field = field;
    this._queries = queries;
  }

  find = async ({
    rid,
    filters = {},
    skip = 0,
    limit = 20,
    sort = null,
    useQuery = null,
  } = {}) => {
    const _pipeline = [
      { $match: { id: rid } },
      { $unwind: { path: `$${this._field}` } },
      { $match: { [this._field]: { $exists: true, $not: { $type: 'array' }, $type: 'object' } } },
      { $replaceRoot: { newRoot: `$${this._field}` } },
      { $match: filters },
      { $set: { rid } },
    ];
    const model = this._queries[useQuery] ?? [];
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
  };

  get = async (rid, id, { useQuery } = {}) => {
    const { data } = await this.find({ rid, filters: { id }, limit: 1, useQuery });
    return data ? data[0] : null;
  };

  create = async (rid, data) => {
    const { modifiedCount } = await this._collection.updateOne(
      { id: rid, [this._field]: { $not: { $elemMatch: { id: data.id } } } },
      { $push: { [this._field]: data } },
    );
    return modifiedCount ? data.id : 0;
  };

  patch = async (rid, id, data) => {
    const pipe = [
      { $match: { id: rid } },
      { $unwind: { path: `$${this._field}` } },
      { $match: { [this._field]: { $exists: true, $not: { $type: 'array' }, $type: 'object' } } },
      { $replaceRoot: { newRoot: `$${this._field}` } },
      { $match: { id } },
    ];
    const currentData = await this._collection.aggregate(pipe).toArray();
    const _data = { ...currentData[0], ...data };
    const { modifiedCount } = await this._collection.updateOne(
      { id: rid, [`${this._field}.id`]: id },
      { $set: { [`${this._field}.$`]: _data } },
    );
    return { ok: !!modifiedCount };
  };

  remove = async (rid, id) => {
    const { modifiedCount } = await this._collection.updateOne(
      { id: rid },
      { $pull: { [this._field]: { id } } },
    );
    return { ok: !!modifiedCount };
  };

  checkResource = async (rid) => {
    const resource = await this._collection.findOne({ id: rid });
    return resource;
  };
}
