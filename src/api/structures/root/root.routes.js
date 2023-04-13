import express from 'express';

import { deleteAlternative, setAlternative } from '../../commons/middlewares/alternative-ids.middlewares';
import { createContext, patchContext, setGeneratedObjectIdInContext, setPutIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { deleteFromElastic, saveInElastic, saveInStore } from '../../commons/middlewares/event.middlewares';
import { requireRoles } from '../../commons/middlewares/rbac.middlewares';
import { validatePayload } from '../../commons/middlewares/validate.middlewares';
import elasticQuery from '../../commons/queries/structures.elastic';
import readQuery from '../../commons/queries/structures.query';
import { structuresRepository as repository } from '../../commons/repositories';
import { structures as resource } from '../../resources';
import {
  createStructureResponse,
  deleteStructure,
  fromPayloadToStructure,
  storeStructure,
  validateStructureCreatePayload,
} from './root.middlewares';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    validateStructureCreatePayload,
    setGeneratedObjectIdInContext(resource),
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
    requireRoles(['admin']),
    patchContext,
    deleteStructure,
    saveInStore(resource),
    deleteFromElastic(),
  ]);

router.route(`/${resource}/:id/alternative-ids/:alternative`)
  .put([
    requireRoles(['admin']),
    patchContext,
    setAlternative(repository, readQuery),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ])
  .delete([
    requireRoles(['admin']),
    patchContext,
    deleteAlternative(repository),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ]);

export default router;
