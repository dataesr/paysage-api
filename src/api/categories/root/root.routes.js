import express from 'express';
import { patchContext, createContext, setGeneratedObjectIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { validatePayload } from './root.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';

import { readQuery } from './root.queries';
import categoriesRepository from './root.repository';
import config from '../categories.config';

const { collection } = config;

const router = new express.Router();

router.route(`/${collection}`)
  .get(controllers.list(categoriesRepository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedObjectIdInContext(collection),
    controllers.create(categoriesRepository, readQuery),
    saveInStore(collection),
  ]);

router.route(`/${collection}/:id`)
  .get(controllers.read(categoriesRepository, readQuery))
  .patch([
    patchContext,
    validatePayload,
    controllers.patch(categoriesRepository, readQuery),
    saveInStore(collection),
  ])
  .delete([
    patchContext,
    controllers.remove(categoriesRepository),
    saveInStore(collection),
  ]);

export default router;
