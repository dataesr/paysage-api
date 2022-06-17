import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import controllers from '../../commons/middlewares/crud-nested.middlewares';
import { readQuery } from './localisations.queries';
import { setGeoJSON, validatePhoneNumber } from './localisations.middlewares';
import repository from './localisations.repository';

const collection = 'projects';
const field = 'localisations';

const router = new express.Router();

router.route(`/${collection}/:resourceId/${field}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeoJSON,
    validatePhoneNumber,
    setGeneratedInternalIdInContext(field),
    controllers.create(repository, readQuery),
    saveInStore(field),
  ]);

router.route(`/${collection}/:resourceId/${field}/:id`)
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(field),
  ])
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    setGeoJSON,
    validatePhoneNumber,
    controllers.patch(repository, readQuery),
    saveInStore(field),
  ]);

export default router;
