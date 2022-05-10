import express from 'express';
import { createCtx, patchCtx } from '../../commons/middlewares/context.middleware';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import identifiers from './identifiers.resource';

const router = new express.Router();

router.route('/persons/:resourceId/identifiers')
  .get(identifiers.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    identifiers.controllers.create,
    saveInStore('persons'),
  ]);

router.route('/persons/:resourceId/identifiers/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    identifiers.controllers.delete,
    saveInStore('persons'),
  ])
  .get(identifiers.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    identifiers.controllers.patch,
    saveInStore('persons'),
  ]);

export default router;
