import express from 'express';
import { createContext, patchContext, setPutIdInContext, setGeneratedObjectIdInContext } from '../../commons/middlewares/context.middleware';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { validatePayload } from '../../commons/middlewares/validate.middlewares';
import { fromPayloadToStructure, validateStructureCreatePayload } from './root.middlewares';
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
    createContext,
    setGeneratedObjectIdInContext(collection),
    controllers.create(structuresRepository, readQuery),
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
