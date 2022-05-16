import express from 'express';
import { patchContext, createContext, setGeneratedObjectIdInContext } from '../../commons/middlewares/context.middleware';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { validatePayload } from './root.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';

import { readQuery } from './root.queries';
import categoriesRepository from './root.repository';
import config from '../categories.config';

const { collectionName } = config;

const router = new express.Router();

router.route(`/${collectionName}`)
  .get(controllers.list(categoriesRepository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedObjectIdInContext(collectionName),
    controllers.create(categoriesRepository, readQuery),
    saveInStore(collectionName),
  ]);

router.route(`/${collectionName}/:id`)
  .get(controllers.read(categoriesRepository, readQuery))
  .patch([
    patchContext,
    validatePayload,
    controllers.patch(categoriesRepository, readQuery),
    saveInStore(collectionName),
  ])
  .delete([
    patchContext,
    controllers.remove(categoriesRepository),
    saveInStore(collectionName),
  ]);

export default router;
