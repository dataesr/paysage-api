import parseSortParams from './helpers';

export default class MongoRepository {
  constructor({ db, collection, queries = {} }) {
    if (!collection) { throw new Error("Parameter 'collection' must be specified"); }
    if (!(typeof collection === 'string' && Object.prototype.toString.call(collection) === '[object String]')) {
      throw new Error("Parameter 'collection' must be a string");
    }
    this.collectionName = collection;
    this._collection = db.collection(collection);
    this._queries = queries;
  }

  find = async ({ filters = {}, skip = 0, limit = 20, sort = null, useQuery } = {}) => {
    const modelPipeline = this._queries[useQuery] || [];
    if (useQuery && !modelPipeline.length) throw new Error(`${useQuery} is not defined`);
    const countPipeline = [{ $match: filters }, { $count: 'totalCount' }];
    const queryPipeline = [
      { $match: filters },
      { $skip: skip },
      { $limit: limit },
      ...modelPipeline,
    ];
    if (sort) { queryPipeline.push({ $sort: parseSortParams(sort) }); }
    const data = await this._collection.aggregate([
      { $facet: { data: queryPipeline, total: countPipeline } },
      { $project: { data: 1, total: { $arrayElemAt: ['$total', 0] } } },
      { $project: { data: 1, totalCount: '$total.totalCount' } },
    ]).toArray();
    return data[0];
  };

  get = async (id, { useQuery } = {}) => {
    const { data } = await this.find({ filters: { id }, limit: 1, useQuery });
    return data ? data[0] : null;
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

  remove = async (id) => {
    const { deletedCount } = await this._collection.deleteOne({ id });
    return { ok: !!deletedCount };
  };

  exists = async (id) => !!await this._collection.findOne({ id });
}
