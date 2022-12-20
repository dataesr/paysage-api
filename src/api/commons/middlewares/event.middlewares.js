import config from '../../../config';
import { eventsRepository } from '../repositories';
import esClient from '../../../services/elastic.service';

const { index } = config.elastic;

export function saveInElastic(repository, useQuery, type) {
  return async (req, res, next) => {
    const { body, params } = req || {};
    const id = params?.resourceId || params?.id || body?.id || req.context.id || undefined;
    const esData = await esClient.search({ index, body: { query: { match: { id } } } });
    const _id = esData?.body?.hits?.hits?.[0]?._id;
    let resource = await repository.get(id, { useQuery, keepDeleted: true });
    resource = { ...resource, isDeleted: resource?.isDeleted || false, type };
    const document = { index, body: resource, refresh: true };
    if (_id) document._id = _id;
    await esClient.index(document);
    return next();
  };
}

export function saveInStore() {
  return async (req, res, next) => {
    const { method, path } = req;
    const userId = req.currentUser.id;
    const splitted = req.path.split('/');
    eventsRepository.create({
      createdAt: new Date(),
      userId,
      resourceType: splitted?.[1],
      resourceId: splitted?.[2] || req.context?.id,
      subResourceType: splitted?.[3],
      subResourceId: ((splitted?.[3]) && splitted?.[4]) || req.context?.id,
      objects: req.context?.objects,
      path,
      method,
    });
    return next();
  };
}
