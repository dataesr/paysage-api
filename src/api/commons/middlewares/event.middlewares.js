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
    try {
      if (_id) {
        const document = { index, body: { doc: resource }, id: _id, refresh: true };
        await esClient.update(document);
      } else {
        const document = { index, body: resource, refresh: true };
        await esClient.index(document);
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 4));
    }
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
