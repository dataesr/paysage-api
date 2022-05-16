import express from 'express';
import { patchContext, createContext, setGeneratedObjectIdInContext } from '../commons/middlewares/context.middleware';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import { validatePayload } from './prices.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';

import { readQuery } from './prices.queries';
import pricesRepository from './prices.repository';
import config from './prices.config';

const { collection } = config;

const router = new express.Router();

router.route(`/${collection}`)
  .get(controllers.list(pricesRepository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedObjectIdInContext(collection),
    controllers.create(pricesRepository, readQuery),
    saveInStore(collection),
  ]);

router.route(`/${collection}/:id`)
  .get(controllers.read(pricesRepository, readQuery))
  .patch([
    patchContext,
    validatePayload,
    controllers.patch(pricesRepository, readQuery),
    saveInStore(collection),
  ])
  .delete([
    patchContext,
    controllers.remove(pricesRepository),
    saveInStore(collection),
  ]);

export default router;
