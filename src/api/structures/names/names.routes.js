import express from 'express';
import { createCtx, patchCtx } from '../../commons/middlewares/context.middleware';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import names from './names.resource';

const router = new express.Router();

router.route('/structures/:rid/names')
  .get(names.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    names.controllers.create,
  ]);

router.route('/structures/:rid/names/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    names.controllers.delete,
  ])
  .get(names.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    names.controllers.patch,
  ]);

export default router;
