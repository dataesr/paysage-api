import db from '../services/database.service';

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

export default class MongoRepository {
  #models;

  #collection;

  constructor({ collection, models = {} }) {
    if (!collection) { throw new Error("Parameter 'collection' must be specified"); }
    if (!(typeof collection === 'string' && Object.prototype.toString.call(collection) === '[object String]')) {
      throw new Error("Parameter 'collection' must be a string");
    }
    this.collectionName = collection;
    this.#collection = db.collection(collection);
    this.#models = models;
  }

  find = async ({ filters = {}, skip = 0, limit = 20, sort = null, useModel } = {}) => {
    const modelPipeline = this.#models[useModel] || [];
    if (useModel && !modelPipeline.length) throw new Error(`${useModel} is not defined`);
    const countPipeline = [{ $match: filters }, { $count: 'totalCount' }];
    const queryPipeline = [
      { $match: filters },
      { $skip: skip },
      { $limit: limit },
      ...modelPipeline,
    ];
    if (sort) { queryPipeline.push({ $sort: parseSortParams(sort) }); }
    const data = await this.#collection.aggregate([
      { $facet: { data: queryPipeline, total: countPipeline } },
      { $project: { data: 1, total: { $arrayElemAt: ['$total', 0] } } },
      { $project: { data: 1, totalCount: '$total.totalCount' } },
    ]).toArray();
    return data[0];
  };

  async get(id, { useModel } = {}) {
    const { data } = await this.find({ filters: { id }, limit: 1, useModel });
    return data ? data[0] : null;
  }

  async create(data) {
    await this.#collection.insertOne(data);
    return data.id;
  }

  async patch(id, data) {
    const unset = Object.keys(data).reduce((arr, field) => (data[field] === null ? ([...arr, field]) : arr), []);
    const set = Object.keys(data).reduce(
      (doc, field) => (data[field] !== null ? ({ ...doc, [field]: data[field] }) : doc),
      {},
    );
    const updatePipeline = (Object.keys(unset).length > 0) ? [{ $set: set }, { $unset: unset }] : [{ $set: set }];
    const { modifiedCount } = await this.#collection.updateOne({ id }, updatePipeline);
    return { ok: !!modifiedCount };
  }

  async remove(id) {
    const { deletedCount } = await this.#collection.deleteOne({ id });
    return { ok: !!deletedCount };
  }

  async exists(id) {
    return !!await this.#collection.findOne({ id });
  }
}
