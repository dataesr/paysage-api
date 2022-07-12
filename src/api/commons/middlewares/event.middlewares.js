import config from '../../../config';
import { eventsRepository } from '../repositories';
import esClient from '../../../services/elastic.service';

const { index } = config.elastic;

export function saveInElastic(repository, useQuery, resourceName) {
  return async (req, res, next) => {
    const { context, params } = req || {};
    const { id } = context || {};
    const { resourceId } = params || {};
    const resource = await repository.get(resourceId, id, { useQuery });
    const name = resource.usualName;
    const body = {
      query: { match_phrase: { content: { query: name, analyzer: 'name_analyzer', slop: 2 } } },
      ids: [resourceId],
      type: resourceName,
      name,
    };
    esClient.index({
      index,
      body,
    });
    return next();
  };
}

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
