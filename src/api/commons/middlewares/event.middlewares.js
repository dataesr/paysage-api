import { eventStore } from '../monster';

export function saveInStore(collection) {
  return async (req, res, next) => {
    const { ctx, event, path } = req;
    if (event) {
      const { user } = ctx || {};
      const nextState = event?.nextState || {};
      const previousState = event?.previousState || {};
      const eventToStore = { ...event, ...{ actor: user, collection, nextState, previousState, resource: path } };
      eventStore.create(eventToStore);
    }
    return next();
  };
}
