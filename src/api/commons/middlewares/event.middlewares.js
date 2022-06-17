import { eventsRepository } from '../repositories';

export function saveInStore(collection) {
  return async (req, res, next) => {
    const { context, event, path } = req;
    if (event) {
      const { user } = context || {};
      const nextState = event?.nextState || {};
      const previousState = event?.previousState || {};
      const eventToStore = { ...event, ...{ actor: user, collection, nextState, previousState, resource: path } };
      eventsRepository.create(eventToStore);
    }
    return next();
  };
}
