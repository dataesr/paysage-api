import express from 'express';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx, setPutIdInContext } from '../../commons/middlewares/context.middleware';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import categories from './root.resource';
import { validatePayload } from './root.middlewares';

const router = new express.Router();

router.route('/categories')
  .get(categories.controllers.list)
  .post([
    // requireActiveUser,
    createCtx,
    validatePayload,
    categories.controllers.create,
    saveInStore('categories'),
  ]);

router.route('/categories/:id')
  .get(categories.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    validatePayload,
    categories.controllers.patch,
    saveInStore('categories'),
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    categories.controllers.delete,
    saveInStore('categories'),
  ])
  .put([
    requireActiveUser,
    createCtx,
    setPutIdInContext('categories'),
    categories.controllers.create,
    saveInStore('categories'),
  ]);

export default router;
