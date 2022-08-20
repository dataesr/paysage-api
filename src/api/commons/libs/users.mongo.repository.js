import BaseMongoRepository from './base.mongo.repository';

export default class UsersMongoRepository extends BaseMongoRepository {
  getByEmail = async (email, { useQuery } = {}) => {
    const { data } = await this.find({ filters: { email }, limit: 1, useQuery });
    return data ? data[0] : null;
  };
}
