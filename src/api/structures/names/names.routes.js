import express from 'express';
import { createCtx, patchCtx } from '../../commons/middlewares/context.middlewares';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import names from './names.resource';

const router = new express.Router();

router.route('/structures/:resourceId/names')
  .get(names.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    names.controllers.create,
    saveInStore('structures'),
  ]);

router.route('/structures/:resourceId/names/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    names.controllers.delete,
    saveInStore('structures'),
  ])
  .get(names.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    names.controllers.patch,
    saveInStore('structures'),
  ]);

export default router;
