import express from 'express';
import { createContext, patchContext, setPutIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { validatePayload } from '../../commons/middlewares/validate.middlewares';
import { createStructureResponse, fromPayloadToStructure, storeStructure, validateStructureCreatePayload } from './root.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import structuresRepository from './root.repository';
import { readQuery } from './root.queries';
import config from '../structures.config';

const { collection } = config;

const router = new express.Router();

router.route(`/${collection}`)
  .get(controllers.list(structuresRepository, readQuery))
  .post([
    validateStructureCreatePayload,
    fromPayloadToStructure,
    storeStructure,
    createStructureResponse,
    saveInStore(collection),
  ]);

router.route(`/${collection}/:id`)
  .get(controllers.read(structuresRepository, readQuery))
  .patch([
    validatePayload,
    patchContext,
    controllers.patch(structuresRepository, readQuery),
    saveInStore(collection),
  ])
  .delete([
    patchContext,
    controllers.remove(structuresRepository),
    saveInStore(collection),
  ])
  .put([
    createContext,
    setPutIdInContext(collection),
    controllers.create(structuresRepository, readQuery),
  ]);

export default router;
