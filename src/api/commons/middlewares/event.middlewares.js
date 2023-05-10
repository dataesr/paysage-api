import config from '../../../config';
import esClient from '../../../services/elastic.service';
import logger from '../../../services/logger.service';
import { eventsRepository } from '../repositories';

const { index } = config.elastic;

export function saveInElastic(repository, useQuery, type) {
  return async (req, res, next) => {
    const { body, params } = req || {};
    const id = params?.resourceId || params?.id || body?.id || req.context.id || undefined;
    let resource = await repository.get(id, { useQuery, keepDeleted: true });
    resource = { ...resource, isDeleted: resource?.isDeleted || false, type };
    const document = { index, body: { doc: resource, doc_as_upsert: true }, id, refresh: true };
    await esClient.update(document).catch((e) => logger.error(JSON.stringify(e, null, 4)));
    return next();
  };
}

export function deleteFromElastic() {
  return async (req, res, next) => {
    const { body, params } = req || {};
    const id = params?.resourceId || params?.id || body?.id || req.context.id || undefined;
    if (!id) return next();
    await esClient.delete({ index, id }).catch((e) => logger.error(JSON.stringify(e, null, 4)));
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
