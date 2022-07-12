import bcrypt from 'bcryptjs';
import BaseMongoRepository from './base.mongo.repository';

export default class UsersMongoRepository extends BaseMongoRepository {
  getByEmail = async (email, { useQuery } = {}) => {
    const { data } = await this.find({ filters: { email }, limit: 1, useQuery });
    return data ? data[0] : null;
  };

  register = async (data) => {
    const password = await bcrypt.hash(data.password, 10);
    const user = {
      ...data,
      role: data.role || 'user',
      active: data.active || false,
      confirmed: data.confirmed || false,
      password,
      createdAt: new Date(),
    };
    await this._collection.insertOne(user);
    return data.id;
  };

  validateUserCredentials = async (email, password) => {
    const user = await this.getByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
  };

  changeUserPasswordById = async (id, password) => {
    const _password = await bcrypt.hash(password, 10);
    return this.patch(id, { password: _password });
  };
}
