import express from 'express';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middleware';
import categories from './categories.resource';
import { validatePayload } from './categories.middlewares';

const router = new express.Router();

router.route('/categories')
  .get(categories.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    validatePayload,
    categories.controllers.create,
  ]);

router.route('/categories/:id')
  .get(categories.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    validatePayload,
    categories.controllers.patch,
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    categories.controllers.delete,
  ]);

export default router;
