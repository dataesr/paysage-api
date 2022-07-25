import config from '../../../config';
import { eventsRepository } from '../repositories';
import esClient from '../../../services/elastic.service';

const { index } = config.elastic;

export function saveInElastic(repository, useQuery, resourceName) {
  return async (req, res, next) => {
    const { body, params } = req || {};
    const id = params?.resourceId || body?.id || undefined;
    await esClient.deleteByQuery({
      index,
      body: { query: { bool: { must: [{ match: { id } }, { term: { type: resourceName } }] } } },
    });
    const resource = await repository.get(id, { useQuery });
    let names = [];
    for (let i = 0; i < resource.names.length; i += 1) {
      names = names.concat(Object.values(resource.names[i]).flat().filter((n) => n));
    }
    names = [...new Set(names)];
    const actions = [];
    names.forEach((name) => {
      actions.push({
        index: { _index: index },
      });
      actions.push({
        query: { match_phrase: { content: { query: name, analyzer: 'name_analyzer', slop: 2 } } },
        id,
        type: resourceName,
        name: resource.currentName.usualName,
        text: name,
      });
    });
    await esClient.bulk({ refresh: true, body: actions });
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
