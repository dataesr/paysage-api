import config from '../../../config';
import { eventsRepository } from '../repositories';
import esClient from '../../../services/elastic.service';

const { index } = config.elastic;

export function saveInElastic(repository, useQuery, resourceName) {
  return async (req, res, next) => {
    const { body, params } = req || {};
    const id = params?.resourceId || params?.id || body?.id || req.context.id || undefined;
    const esData = await esClient.search({ index, body: { query: { match: { id } } } });
    const _id = esData?.body?.hits?.hits?.[0]?._id;
    const resource = await repository.get(id, { useQuery, keepDeleted: true });
    let fields = [];
    for (let i = 0; i < resource?.toindex?.length || 0; i += 1) {
      fields = fields.concat(Object.values(resource.toindex[i]).flat().filter((n) => n));
    }
    fields = [...new Set(fields)];
    const action = {
      search: fields.join(' '),
      type: resourceName,
      id,
      acronym: resource?.acronym,
      isDeleted: resource?.isDeleted || false,
      name: resource?.name,
    };
    if (resourceName === 'structures') {
      action.creationDate = resource?.creationDate;
      action.locality = resource?.locality?.[0];
    }
    const actions = [];
    actions.push(_id ? { index: { _index: index, _id } } : { index: { _index: index } });
    actions.push(action);
    await esClient.bulk({ refresh: true, body: actions });
    return next();
  };
}

export function saveInStore() {
  return async (req, res, next) => {
    const { path, method } = req;
    const userId = req.currentUser.id;
    const splitted = req.path.split('/');
    eventsRepository.create({
      createdAt: new Date(),
      userId,
      resourceType: splitted?.[1],
      resourceId: splitted?.[2] || req.context?.id,
      subResourceType: splitted?.[3],
      surResourceId: splitted?.[4] || req.context?.id,
      path,
      method,
    });
    return next();
  };
}
