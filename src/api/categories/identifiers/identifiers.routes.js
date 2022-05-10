import express from 'express';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../../commons/middlewares/context.middleware';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import identifiers from './identifiers.resource';

const router = new express.Router();

router.route('/categories/:resourceId/identifiers')
  .get(identifiers.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    identifiers.controllers.create,
    saveInStore('categories'),
  ]);

router.route('/categories/:resourceId/identifiers/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    identifiers.controllers.delete,
    saveInStore('categories'),
  ])
  .get(identifiers.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    identifiers.controllers.patch,
    saveInStore('categories'),
  ]);

export default router;
