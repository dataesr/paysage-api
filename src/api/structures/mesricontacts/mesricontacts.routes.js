import express from 'express';
import { createCtx, patchCtx } from '../../commons/middlewares/context.middleware';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { validatePayload } from './mesricontacts.middlewares';
import mesricontacts from './mesricontacts.resource';

const router = new express.Router();

router.route('/structures/:resourceId/mesricontacts')
  .get(mesricontacts.controllers.list)
  .post([
    // requireActiveUser,
    validatePayload,
    createCtx,
    mesricontacts.controllers.create,
  ]);

router.route('/structures/:resourceId/mesricontacts/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    mesricontacts.controllers.delete,
  ])
  .get(mesricontacts.controllers.read)
  .patch([
    requireActiveUser,
    validatePayload,
    patchCtx,
    mesricontacts.controllers.patch,
  ]);

export default router;
