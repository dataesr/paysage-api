import express from 'express';
import { createCtx, patchCtx } from '../../commons/middlewares/context.middleware';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import weblinks from './weblinks.resource';

const router = new express.Router();

router.route('/structures/:resourceId/weblinks')
  .get(weblinks.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    weblinks.controllers.create,
  ]);

router.route('/structures/:resourceId/weblinks/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    weblinks.controllers.delete,
  ])
  .get(weblinks.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    weblinks.controllers.patch,
  ]);

export default router;
