import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import controllers from '../../commons/middlewares/crud-nested.middlewares';
import { projectLocalisationsRepository as repository } from '../../commons/repositories';
import { readQuery } from '../../commons/queries/localisations.queries';
import { setGeoJSON, validatePhoneNumber } from './localisations.middlewares';
import { projects as resource, localisations as subresource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}/:resourceId/${subresource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeoJSON,
    validatePhoneNumber,
    setGeneratedInternalIdInContext(subresource),
    controllers.create(repository, readQuery),
    saveInStore(subresource),
  ]);

router.route(`/${resource}/:resourceId/${subresource}/:id`)
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(subresource),
  ])
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    setGeoJSON,
    validatePhoneNumber,
    controllers.patch(repository, readQuery),
    saveInStore(subresource),
  ]);

export default router;
