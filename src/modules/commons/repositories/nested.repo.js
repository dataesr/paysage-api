import BaseRepo from './base.repo';

export default class NestedRepo extends BaseRepo {
  constructor({ collection, field, pipeline = [] }) {
    if (!field) { throw new Error('field must be specified'); }
    if (!(typeof field === 'string' && Object.prototype.toString.call(field) === '[object String]')) {
      throw new Error('field must be a string');
    }
    super({ collection, pipeline });
    this._field = field;
  }

  async _getUniqueId() {
    const currentId = await this._collection.aggregate(
      [{ $project: { id: { $max: `$${this._field}.id` } } }],
    ).toArray();
    if (currentId[0].id) { return currentId[0].id + 1; }
    return 1;
  }

  async find(rid, filters = {}, { skip = 0, limit = 20, sort = null, returnFields = null } = {}) {
    if (!rid) { throw new Error('A ressource identifier must be specified to find subresources'); }
    const _pipeline = [
      { $match: { id: rid } },
      { $unwind: { path: `$${this._field}` } },
      { $match: { [this._field]: { $exists: true, $not: { $type: 'array' }, $type: 'object' } } },
      { $replaceRoot: { newRoot: `$${this._field}` } },
      { $match: filters },
    ];
    const queryPipeline = [
      ..._pipeline,
      { $skip: skip || 0 },
      { $limit: limit || 20 },
      ...this._globalPipeline,
      ...this._pipeline,
    ];
    if (returnFields) queryPipeline.push({ $project: this._parseReturnFieldsParams(returnFields) });
    if (sort) queryPipeline.push({ $sort: this._parseSortParams(sort) });
    const countPipeline = [..._pipeline, { $count: 'totalCount' }];
    const data = await this._collection.aggregate([
      { $facet: { data: queryPipeline, total: countPipeline } },
      { $project: { data: 1, total: { $arrayElemAt: ['$total', 0] } } },
      { $project: { data: 1, totalCount: '$total.totalCount' } },
    ]).toArray();
    return data[0];
  }

  async findById(rid, id, { returnFields = null } = {}) {
    if (!rid) { throw new Error('A ressource identifier must be specified to find subresources'); }
    const { data } = await this.find(rid, { id }, { limit: 1, returnFields });
    return data ? data[0] : null;
  }

  async insert(rid, data) {
    if (!rid) { throw new Error('A ressource identifier must be specified to find subresources'); }
    const id = await this._getUniqueId();
    const _data = { ...data, id, createdAt: new Date(), updatedAt: new Date() };
    const { modifiedCount } = await this._collection.updateOne(
      { id: rid, [this._field]: { $not: { $elemMatch: { id: _data.id } } } },
      { $push: { [this._field]: _data } },
    );
    return modifiedCount ? id : 0;
  }

  async updateById(rid, id, data) {
    if (!rid) { throw new Error('A ressource identifier must be specified to find subresources'); }
    const pipe = [
      { $match: { id: rid } },
      { $unwind: { path: `$${this._field}` } },
      { $match: { [this._field]: { $exists: true, $not: { $type: 'array' }, $type: 'object' } } },
      { $replaceRoot: { newRoot: `$${this._field}` } },
      { $match: { id } },
    ];
    const currentData = await this._collection.aggregate(pipe).toArray();
    const _data = { ...currentData[0], ...data, updatedAt: new Date() };
    const { modifiedCount } = await this._collection.updateOne(
      { id: rid, [`${this._field}.id`]: id },
      { $set: { [`${this._field}.$`]: _data } },
    );
    return { ok: !!modifiedCount };
  }

  async deleteById(rid, id) {
    if (!rid) { throw new Error('A ressource identifier must be specified to find subresources'); }
    const { modifiedCount } = await this._collection.updateOne({ id: rid }, { $pull: { [this._field]: { id } } });
    return { ok: !!modifiedCount };
  }
}
