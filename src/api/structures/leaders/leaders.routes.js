import express from 'express';
import { createCtx, patchCtx } from '../../commons/middlewares/context.middleware';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { validatePayload } from './leaders.middlewares';
import leaders from './leaders.resource';

const router = new express.Router();

router.route('/structures/:resourceId/leaders')
  .get(leaders.controllers.list)
  .post([
    // requireActiveUser,
    validatePayload,
    createCtx,
    leaders.controllers.create,
    saveInStore('structures'),
  ]);

router.route('/structures/:resourceId/leaders/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    leaders.controllers.delete,
    saveInStore('structures'),
  ])
  .get(leaders.controllers.read)
  .patch([
    requireActiveUser,
    validatePayload,
    patchCtx,
    leaders.controllers.patch,
    saveInStore('structures'),
  ]);

export default router;
