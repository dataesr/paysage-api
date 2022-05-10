import express from 'express';
import { createCtx, patchCtx } from '../../commons/middlewares/context.middlewares';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
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
    saveInStore('structures'),
  ]);

router.route('/structures/:resourceId/mesricontacts/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    mesricontacts.controllers.delete,
    saveInStore('structures'),
  ])
  .get(mesricontacts.controllers.read)
  .patch([
    requireActiveUser,
    validatePayload,
    patchCtx,
    mesricontacts.controllers.patch,
    saveInStore('structures'),
  ]);

export default router;
