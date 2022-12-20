import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInElastic, saveInStore } from '../../commons/middlewares/event.middlewares';
import controllers from '../../commons/middlewares/crud-nested.middlewares';
import { structureLocalisationsRepository as repository, structuresRepository } from '../../commons/repositories';
import elasticQuery from '../../commons/queries/structures.elastic';
import readQuery from '../../commons/queries/localisations.query';
import { setGeoJSON, validatePhoneNumberAndIso3 } from './localisations.middlewares';
import { structures as resource, localisations as subresource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}/:resourceId/${subresource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeoJSON,
    validatePhoneNumberAndIso3,
    setGeneratedInternalIdInContext(subresource),
    controllers.create(repository, readQuery),
    saveInStore(subresource),
    saveInElastic(structuresRepository, elasticQuery, resource),
  ]);

router.route(`/${resource}/:resourceId/${subresource}/:id`)
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    setGeoJSON,
    validatePhoneNumberAndIso3,
    controllers.patch(repository, readQuery),
    saveInStore(subresource),
    saveInElastic(structuresRepository, elasticQuery, resource),
  ])
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(subresource),
    saveInElastic(structuresRepository, elasticQuery, resource),
  ]);

export default router;
