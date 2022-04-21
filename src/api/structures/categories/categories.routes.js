import express from 'express';
import { createCtx, patchCtx } from '../../commons/middlewares/context.middleware';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { validatePayload } from './categories.middlewares';
import categories from './categories.resource';

const router = new express.Router();

router.route('/structures/:rid/categories')
  .get(categories.controllers.list)
  .post([
    requireActiveUser,
    validatePayload,
    createCtx,
    categories.controllers.create,
  ]);

router.route('/structures/:rid/categories/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    categories.controllers.delete,
  ])
  .get(categories.controllers.read)
  .patch([
    requireActiveUser,
    validatePayload,
    patchCtx,
    categories.controllers.patch,
  ]);

export default router;
