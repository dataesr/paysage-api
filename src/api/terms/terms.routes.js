import express from 'express';
import { patchContext, createContext, setGeneratedObjectIdInContext } from '../commons/middlewares/context.middleware';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import { validatePayload } from './terms.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';

import { readQuery } from './terms.queries';
import termsRepository from './terms.repository';
import config from './terms.config';

const { collection } = config;

const router = new express.Router();

router.route(`/${collection}`)
  .get(controllers.list(termsRepository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedObjectIdInContext(collection),
    controllers.create(termsRepository, readQuery),
    saveInStore(collection),
  ]);

router.route(`/${collection}/:id`)
  .get(controllers.read(termsRepository, readQuery))
  .patch([
    patchContext,
    validatePayload,
    controllers.patch(termsRepository, readQuery),
    saveInStore(collection),
  ])
  .delete([
    patchContext,
    controllers.remove(termsRepository),
    saveInStore(collection),
  ]);

export default router;
