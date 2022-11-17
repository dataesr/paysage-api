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
    resource.isDeleted = resource?.isDeleted || false;
    resource.type = resourceName;
    const actions = [];
    actions.push(_id ? { index: { _index: index, _id } } : { index: { _index: index } });
    actions.push(resource);
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
