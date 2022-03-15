import express from 'express';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx, setPutIdInContext } from '../../commons/middlewares/context.middleware';
import categories from './root.resource';
import { validatePayload } from './root.middlewares';

const router = new express.Router();

// CATEGORIES
router.route('/categories')
  .get(categories.controllers.list)
  .post([
    // requireActiveUser,
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
  ])
  .put([
    requireActiveUser,
    createCtx,
    setPutIdInContext('categories'),
    categories.controllers.create,
  ]);

export default router;
