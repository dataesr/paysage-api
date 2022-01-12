import BaseRepo from './base.repo';

class EventRepository extends BaseRepo {}

export default new EventRepository({ collection: 'events', pipeline: [] });
