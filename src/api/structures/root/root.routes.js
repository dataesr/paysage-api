import express from 'express';
import { createContext, patchContext, setPutIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInElastic, saveInStore } from '../../commons/middlewares/event.middlewares';
import { validatePayload } from '../../commons/middlewares/validate.middlewares';
import { createStructureResponse, fromPayloadToStructure, storeStructure, validateStructureCreatePayload } from './root.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { structuresRepository as repository } from '../../commons/repositories';
import elasticQuery from '../../commons/queries/structures.elastic';
import readQuery from '../../commons/queries/structures.query';
import { structures as resource } from '../../resources';

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
    controllers.create(repository, readQuery),
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
    controllers.remove(repository),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ]);

export default router;
