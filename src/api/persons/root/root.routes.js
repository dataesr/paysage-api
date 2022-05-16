import express from 'express';
import { patchContext, createContext, setGeneratedObjectIdInContext } from '../../commons/middlewares/context.middleware';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { validatePayload } from '../../commons/middlewares/validate.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';

import { readQuery } from './root.queries';
import personsRepository from './root.repository';
import config from '../persons.config';

const { collectionName } = config;

const router = new express.Router();

router.route(`/${collectionName}`)
  .get(controllers.list(personsRepository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedObjectIdInContext(collectionName),
    controllers.create(personsRepository, readQuery),
    saveInStore(collectionName),
  ]);

router.route(`/${collectionName}/:id`)
  .get(controllers.read(personsRepository, readQuery))
  .patch([
    patchContext,
    validatePayload,
    controllers.patch(personsRepository, readQuery),
    saveInStore(collectionName),
  ])
  .delete([
    patchContext,
    controllers.remove(personsRepository),
    saveInStore(collectionName),
  ]);

export default router;
