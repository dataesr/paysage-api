import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud-nested.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { readQuery, readQueryWithLookup } from '../../commons/queries/localisations.query';
import { projectLocalisationsRepository as repository } from '../../commons/repositories';
import { localisations as subresource, projects as resource } from '../../resources';
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
  ]);

router.route(`/${resource}/:resourceId/${subresource}/:id`)
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(subresource),
  ])
  .get(controllers.read(repository, readQueryWithLookup))
  .patch([
    patchContext,
    setGeoJSON,
    validatePhoneNumberAndIso3,
    controllers.patch(repository, readQueryWithLookup),
    saveInStore(subresource),
  ]);

export default router;
