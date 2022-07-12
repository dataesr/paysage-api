import config from '../../../config';
import { eventsRepository } from '../repositories';
import esClient from '../../../services/elastic.service';

const { index } = config.elastic;

export function saveInElastic(repository, useQuery, resourceName) {
  return async (req, res, next) => {
    const { context, params } = req || {};
    const id = context?.id || params?.id || undefined;
    const { resourceId } = params || {};
    const resource = await repository.get(resourceId, id, { useQuery });
    const names = [...new Set(Object.values(resource).flat().filter((n) => n))];
    const body = [];
    names.forEach((name) => {
      body.push({
        index: { _index: index },
      });
      body.push({
        query: { match_phrase: { content: { query: name, analyzer: 'name_analyzer', slop: 2 } } },
        ids: [resourceId],
        type: resourceName,
        name,
      });
    });
    await esClient.bulk({ refresh: true, body });
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
