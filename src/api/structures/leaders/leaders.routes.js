import express from 'express';
import { createCtx, patchCtx } from '../../commons/middlewares/context.middleware';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { validatePayload } from './leaders.middlewares';
import leaders from './leaders.resource';

const router = new express.Router();

router.route('/structures/:rid/leaders')
  .get(leaders.controllers.list)
  .post([
    // requireActiveUser,
    validatePayload,
    createCtx,
    leaders.controllers.create,
  ]);

router.route('/structures/:rid/leaders/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    leaders.controllers.delete,
  ])
  .get(leaders.controllers.read)
  .patch([
    requireActiveUser,
    validatePayload,
    patchCtx,
    leaders.controllers.patch,
  ]);

export default router;
