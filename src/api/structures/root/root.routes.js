import express from 'express';

import { createContext, patchContext, setPutIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { saveInElastic, saveInStore } from '../../commons/middlewares/event.middlewares';
import { validatePayload } from '../../commons/middlewares/validate.middlewares';
import elasticQuery from '../../commons/queries/structures.elastic';
import readQuery from '../../commons/queries/structures.query';
import { structuresRepository as repository } from '../../commons/repositories';
import { structures as resource } from '../../resources';
import { canIDelete, createStructureResponse, fromPayloadToStructure, storeStructure, validateStructureCreatePayload } from './root.middlewares';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    validateStructureCreatePayload,
    fromPayloadToStructure,
    storeStructure,
    createStructureResponse,
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ]);

router.route(`/${resource}/:id`)
  .get(controllers.read(repository, readQuery))
  .put([
    createContext,
    setPutIdInContext(resource),
    fromPayloadToStructure,
    controllers.create(repository, readQuery),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ])
  .patch([
    validatePayload,
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ])
  .delete([
    patchContext,
    canIDelete,
    controllers.softDelete(repository),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ]);

export default router;
