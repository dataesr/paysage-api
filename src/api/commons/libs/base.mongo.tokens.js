import BaseMongoRepository from './base.mongo.repository';

class BaseMongoTokens extends BaseMongoRepository {
  upsert = async (filters, data) => {
    const { modifiedCount } = await this._collection.updateOne(filters, { $set: data }, { upsert: true });
    return { ok: !!modifiedCount };
  };

  remove = async (filters) => this._collection.deleteMany(filters);

  get = async (filters) => this._collection.findOne(filters);
}

export default BaseMongoTokens;
