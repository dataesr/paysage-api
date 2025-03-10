import BaseMongoRepository from './base.mongo.repository';

export default class UsersMongoRepository extends BaseMongoRepository {
  getByEmail = async (email, { useQuery } = {}) => {
    const _email = email.toLowerCase();
    const { data } = await this.find({ filters: { email: _email }, limit: 1, useQuery });
    return data ? data[0] : null;
  };

  setPassword = async (id, password) => {
    const { modifiedCount } = await this._collection.updateOne({ id }, { $set: { password } });
    return { ok: !!modifiedCount };
  };

  setOtpRequired = async (id, isOtpRequired) => {
    const { modifiedCount } = await this._collection.updateOne({ id }, { $set: { isOtpRequired } });
    return { ok: !!modifiedCount };
  };

  setLastLogin = async (id) => {
    const { modifiedCount } = await this._collection.updateOne({ id }, { $set: { lastLogin: new Date() } });
    return { ok: !!modifiedCount };
  };
}
