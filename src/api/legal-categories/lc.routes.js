import express from 'express';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middleware';
import lc from './lc.resource';
import { validatePayload } from './lc.middlewares';

const router = new express.Router();

router.route('/legal-categories')
  .get(lc.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    validatePayload,
    lc.controllers.create,
  ]);

router.route('/legal-categories/:id')
  .get(lc.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    validatePayload,
    lc.controllers.patch,
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    lc.controllers.delete,
  ]);

export default router;
