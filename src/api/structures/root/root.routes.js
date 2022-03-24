import express from 'express';
import { createCtx, patchCtx, setPutIdInContext } from '../../commons/middlewares/context.middleware';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import structures from './root.resource';
import { setDefaultStatus } from './root.middlewares';

const router = new express.Router();

// STUCTURES
router.route('/structures')
  .get(structures.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    setDefaultStatus('draft'),
    structures.controllers.create,
  ]);

router.route('/structures/:id')
  .get(structures.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    structures.controllers.patch,
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    structures.controllers.delete,
  ])
  .put([
    requireActiveUser,
    createCtx,
    setPutIdInContext('structures'),
    setDefaultStatus('published'),
    structures.controllers.create,
  ]);

export default router;
