import express from 'express';
import { createCtx, patchCtx, setPutIdInContext } from '../../commons/middlewares/context.middlewares';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { fromPayloadToStructure, validateStructureCreatePayload } from './root.middlewares';
import structures from './root.resource';

const router = new express.Router();

router.route('/structures')
  .get(structures.controllers.list)
  .post([
    // requireActiveUser,
    createCtx,
    validateStructureCreatePayload,
    fromPayloadToStructure,
    structures.controllers.create,
    saveInStore('structures'),
  ]);

router.route('/structures/:id')
  .get(structures.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    structures.controllers.patch,
    saveInStore('structures'),
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    structures.controllers.delete,
    saveInStore('structures'),
  ])
  .put([
    requireActiveUser,
    createCtx,
    setPutIdInContext('structures'),
    structures.controllers.create,
  ]);

export default router;
