import express from 'express';
import { patchContext, createContext, setGeneratedObjectIdInContext } from '../commons/middlewares/context.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';

import { readQuery } from './identifiers.queries';
import identifiersRepository from './identifiers.repository';
import config from './identifiers.config';

const { collection } = config;

const router = new express.Router();

router.route(`/${collection}/:resourceId`)
  .get(controllers.list(identifiersRepository, readQuery))
  .post([
    createContext,
    setGeneratedObjectIdInContext(collection),
    controllers.create(identifiersRepository, readQuery),
    saveInStore(collection),
  ]);

/*
router.route(`/${collection}/:id`)
  .get(controllers.read(identifiersRepository, readQuery))
  .patch([
    patchContext,
    // validatePayload,
    controllers.patch(identifiersRepository, readQuery),
    saveInStore(collection),
  ])
  .delete([
    patchContext,
    controllers.remove(identifiersRepository),
    saveInStore(collection),
  ]);
*/

export default router;
