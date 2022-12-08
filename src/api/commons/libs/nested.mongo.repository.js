import parseSortParams from './helpers';

class NestedMongoRepository {
  constructor({ db, collection, field, queries = {} }) {
    if (!field) { throw new Error("Parameter 'field' must be specified"); }
    if (!(typeof field === 'string' && Object.prototype.toString.call(field) === '[object String]')) {
      throw new Error("Parameter 'field' must be a string");
    }
    this.collectionName = collection;
    this.fieldName = field;
    this._collection = db.collection(collection);
    this._field = field;
    this._queries = queries;
  }

  find = async ({
    resourceId,
    filters = {},
    skip = 0,
    limit = 10000,
    sort = '-createdAt',
    useQuery = [],
  } = {}) => {
    const pipeline = [
      { $match: { id: resourceId } },
      { $unwind: { path: `$${this._field}` } },
      { $match: { [this._field]: { $exists: true, $not: { $type: 'array' }, $type: 'object' } } },
      { $replaceRoot: { newRoot: `$${this._field}` } },
      { $match: filters },
      { $set: { resourceId } },
      ...useQuery,
      { $setWindowFields: { output: { totalCount: { $count: {} } } } },
      { $sort: parseSortParams(sort) },
      { $skip: skip },
      { $limit: limit },
      { $group: { _id: null, data: { $push: "$$ROOT" }, totalCount: { $max: "$totalCount" } } },
      { $project: { _id: 0, 'data.totalCount': 0 } }
    ];
    const data = await this._collection.aggregate(pipeline).toArray();
    return data?.[0]?.data ? data[0] : { data: [], totalCount: 0 };
  };

  get = async (resourceId, id, { useQuery } = []) => {
    const { data } = await this.find({ resourceId, filters: { id }, limit: 1, useQuery });
    return data ? data[0] : null;
  };

  create = async (resourceId, data) => {
    const { modifiedCount } = await this._collection.updateOne(
      { id: resourceId, [this._field]: { $not: { $elemMatch: { id: data.id } } } },
      { $push: { [this._field]: data } },
    );
    return modifiedCount ? data.id : 0;
  };

  patch = async (resourceId, id, data) => {
    const pipe = [
      { $match: { id: resourceId } },
      { $unwind: { path: `$${this._field}` } },
      { $match: { [this._field]: { $exists: true, $not: { $type: 'array' }, $type: 'object' } } },
      { $replaceRoot: { newRoot: `$${this._field}` } },
      { $match: { id } },
    ];
    const currentData = await this._collection.aggregate(pipe).toArray();
    const _data = { ...currentData[0], ...data };
    const __data = Object.keys(_data).reduce(
      (doc, field) => ([null, ''].includes(_data[field]) ? doc : ({ ...doc, [field]: _data[field] })),
      {},
    );
    const { modifiedCount } = await this._collection.updateOne(
      { id: resourceId, [`${this._field}.id`]: id },
      { $set: { [`${this._field}.$`]: __data } },
    );
    return { ok: !!modifiedCount };
  };

  put = async (resourceId, id, data) => {
    const _data = Object.keys(data).reduce(
      (doc, field) => ([null, ''].includes(data[field]) ? doc : ({ ...doc, [field]: data[field] })),
      {},
    );
    const { modifiedCount } = await this._collection.updateOne(
      { id: resourceId, [`${this._field}.id`]: id },
      { $set: { [`${this._field}.$`]: _data } },
    );
    return { ok: !!modifiedCount };
  };

  remove = async (resourceId, id) => {
    const { modifiedCount } = await this._collection.updateOne(
      { id: resourceId },
      { $pull: { [this._field]: { id } } },
    );
    return { ok: !!modifiedCount };
  };

  checkResource = async (resourceId) => {
    const resource = await this._collection.findOne({ id: resourceId });
    return resource;
  };
}

export default NestedMongoRepository;
