import express from 'express';
import { patchContext, createContext, setGeneratedObjectIdInContext } from '../commons/middlewares/context.middleware';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import { validatePayload } from './terms.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';

import { readQuery } from './terms.queries';
import termsRepository from './terms.repository';
import config from './terms.config';

const { collectionName } = config;

const router = new express.Router();

router.route(`/${collectionName}`)
  .get(controllers.list(termsRepository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedObjectIdInContext(collectionName),
    controllers.create(termsRepository, readQuery),
    saveInStore(collectionName),
  ]);

router.route(`/${collectionName}/:id`)
  .get(controllers.read(termsRepository, readQuery))
  .patch([
    patchContext,
    validatePayload,
    controllers.patch(termsRepository, readQuery),
    saveInStore(collectionName),
  ])
  .delete([
    patchContext,
    controllers.remove(termsRepository),
    saveInStore(collectionName),
  ]);

export default router;
