import BaseRepo from './base.repo';

class EventRepository extends BaseRepo {
  // async insert(data, { session = null } = {}) {
  //   const {}
  //   await this._collection.insertOne(data, { session });
  //   return data.id;
  // }
}

export default new EventRepository({ collection: 'events', pipeline: [] });
