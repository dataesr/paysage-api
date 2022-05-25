import express from 'express';

import config from '../persons.config';
import { patchContext, createContext, setGeneratedObjectIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { validatePayload } from '../../commons/middlewares/validate.middlewares';
import { readQuery } from './root.queries';
import personsRepository from './root.repository';

const { collection } = config;

const router = new express.Router();

router.route(`/${collection}`)
  .get(controllers.list(personsRepository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedObjectIdInContext(collection),
    controllers.create(personsRepository, readQuery),
    saveInStore(collection),
  ]);

router.route(`/${collection}/:id`)
  .get(controllers.read(personsRepository, readQuery))
  .patch([
    patchContext,
    validatePayload,
    controllers.patch(personsRepository, readQuery),
    saveInStore(collection),
  ])
  .delete([
    patchContext,
    controllers.remove(personsRepository),
    saveInStore(collection),
  ]);

export default router;
