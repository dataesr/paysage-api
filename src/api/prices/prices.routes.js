import express from 'express';
import { patchContext, createContext, setGeneratedObjectIdInContext } from '../commons/middlewares/context.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import { validatePayload } from './prices.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';

import readQuery from '../commons/queries/prices.query';
import { pricesRepository as repository } from '../commons/repositories';
import { prices as resource } from '../resources';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedObjectIdInContext(resource),
    controllers.create(repository, readQuery),
    saveInStore(resource),
  ]);

router.route(`/${resource}/:id`)
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    validatePayload,
    controllers.patch(repository, readQuery),
    saveInStore(resource),
  ])
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(resource),
  ]);

export default router;
