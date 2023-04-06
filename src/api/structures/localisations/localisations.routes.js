import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud-nested.middlewares';
import { saveInElastic, saveInStore } from '../../commons/middlewares/event.middlewares';
import { readQuery, readQueryWithLookup } from '../../commons/queries/localisations.query';
import elasticQuery from '../../commons/queries/structures.elastic';
import { structureLocalisationsRepository as repository, structuresRepository } from '../../commons/repositories';
import { localisations as subresource, structures as resource } from '../../resources';
import { setGeoJSON, validatePhoneNumberAndIso3 } from './localisations.middlewares';

const router = new express.Router();

router.route(`/${resource}/:resourceId/${subresource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeoJSON,
    validatePhoneNumberAndIso3,
    setGeneratedInternalIdInContext(subresource),
    controllers.create(repository, readQueryWithLookup),
    saveInStore(subresource),
    saveInElastic(structuresRepository, elasticQuery, resource),
  ]);

router.route(`/${resource}/:resourceId/${subresource}/:id`)
  .get(controllers.read(repository, readQueryWithLookup))
  .patch([
    patchContext,
    setGeoJSON,
    validatePhoneNumberAndIso3,
    controllers.patch(repository, readQueryWithLookup),
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
