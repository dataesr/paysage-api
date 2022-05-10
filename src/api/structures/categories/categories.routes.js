import express from 'express';
import { createCtx, patchCtx } from '../../commons/middlewares/context.middleware';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { validatePayload } from './categories.middlewares';
import categories from './categories.resource';

const router = new express.Router();

router.route('/structures/:resourceId/categories')
  .get(categories.controllers.list)
  .post([
    requireActiveUser,
    validatePayload,
    createCtx,
    categories.controllers.create,
    saveInStore('structures'),
  ]);

router.route('/structures/:resourceId/categories/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    categories.controllers.delete,
    saveInStore('structures'),
  ])
  .get(categories.controllers.read)
  .patch([
    requireActiveUser,
    validatePayload,
    patchCtx,
    categories.controllers.patch,
    saveInStore('structures'),
  ]);

export default router;
