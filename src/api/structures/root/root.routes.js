import express from 'express';
import { createContext, patchContext, setPutIdInContext, setGeneratedObjectIdInContext } from '../../commons/middlewares/context.middleware';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { validatePayload } from '../../commons/middlewares/validate.middlewares';
import { fromPayloadToStructure, validateStructureCreatePayload } from './root.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import structuresRepository from './root.repository';
import { readQuery } from './root.queries';
import config from '../structures.config';

const { collectionName } = config;

const router = new express.Router();

router.route(`/${collectionName}`)
  .get(controllers.list(structuresRepository, readQuery))
  .post([
    validateStructureCreatePayload,
    fromPayloadToStructure,
    createContext,
    setGeneratedObjectIdInContext(collectionName),
    controllers.create(structuresRepository, readQuery),
    saveInStore(collectionName),
  ]);

router.route(`/${collectionName}/:id`)
  .get(controllers.read(structuresRepository, readQuery))
  .patch([
    validatePayload,
    patchContext,
    controllers.patch(structuresRepository, readQuery),
    saveInStore(collectionName),
  ])
  .delete([
    patchContext,
    controllers.remove(structuresRepository),
    saveInStore(collectionName),
  ])
  .put([
    createContext,
    setPutIdInContext(config.collectionName),
    controllers.create(structuresRepository, readQuery),
  ]);

export default router;
