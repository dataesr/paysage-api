import parseSortParams from './helpers';

class BaseMongoRepository {
  constructor({ db, collection }) {
    if (!collection) { throw new Error("Parameter 'collection' must be specified"); }
    if (!(typeof collection === 'string' && Object.prototype.toString.call(collection) === '[object String]')) {
      throw new Error("Parameter 'collection' must be a string");
    }
    this.collectionName = collection;
    this._collection = db.collection(collection);
  }

  find = async ({
    filters = {}, skip = 0, limit = 10000, sort = "-createdAt", useQuery = [], keepDeleted = false,
  } = {}) => {
    const _filters = keepDeleted ? filters : { $and: [{ isDeleted: { $ne: true } }, filters] };
    const pipeline = [
      { $match: _filters },
      ...useQuery,
      { $setWindowFields: { output: {totalCount: { $count: {}}}}},
      { $sort: parseSortParams(sort) },
      { $skip: skip },
      { $limit: limit },
      { $group: { _id: null, data: { $push: "$$ROOT" }, totalCount: { $max: "$totalCount" } } },
      { $project: { _id: 0, 'data.totalCount': 0 } }
    ];
    const data = await this._collection.aggregate(pipeline).toArray();
    return data?.[0]?.data ? data[0] : { data: [], totalCount: 0 };
  };

  get = async (id, { useQuery = [], keepDeleted = false } = {}) => {
    const filters = keepDeleted ? { id } : { $and: [{ isDeleted: { $ne: true } }, { id }] }
    const data = await this._collection.aggregate([
      { $match: filters },
      { $limit: 1 },
      ...useQuery,
    ]).toArray();
    return data?.[0];
  };

  create = async (data) => {
    await this._collection.insertOne(data);
    return data.id;
  };

  patch = async (id, data) => {
    const unset = Object.keys(data).reduce((arr, field) => ([null, ''].includes(data[field]) ? ([...arr, field]) : arr), []);
    const set = Object.keys(data).reduce(
      (doc, field) => ([null, ''].includes(data[field]) ? doc : ({ ...doc, [field]: data[field] })),
      {},
    );
    const updatePipeline = (Object.keys(unset).length > 0) ? [{ $set: set }, { $unset: unset }] : [{ $set: set }];
    const { modifiedCount } = await this._collection.updateOne({ id }, updatePipeline);
    return { ok: !!modifiedCount };
  };

  put = async (id, data) => {
    const { modifiedCount } = await this._collection.updateOne({ id }, data);
    return { ok: !!modifiedCount };
  };

  upsert = async (filters, data) => {
    const { acknowledged } = await this._collection.updateOne(filters, data, { upsert: true });
    return { ok: acknowledged };
  };

  remove = async (id) => {
    const { deletedCount } = await this._collection.deleteOne({ id });
    return { ok: !!deletedCount };
  };

  deleteOne = async (filters) => {
    const { deletedCount } = await this._collection.deleteOne(filters);
    return { ok: !!deletedCount };
  };

  exists = async (id) => !!await this._collection.findOne({ id });
}

export default BaseMongoRepository;
