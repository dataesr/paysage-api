import BaseRepo from './base.repo';

class EventRepository extends BaseRepo {
  static async cancel(id) {
    console.log(`Attempt to cancel event ${id}`);
    throw new Error('Not Implemented');
  }
}

export default new EventRepository({ collection: 'events', pipeline: [] });
