import express from 'express';
import { createCtx, patchCtx } from '../../commons/middlewares/context.middlewares';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import weblinks from './weblinks.resource';

const router = new express.Router();

router.route('/structures/:resourceId/weblinks')
  .get(weblinks.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    weblinks.controllers.create,
    saveInStore('structures'),
  ]);

router.route('/structures/:resourceId/weblinks/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    weblinks.controllers.delete,
    saveInStore('structures'),
  ])
  .get(weblinks.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    weblinks.controllers.patch,
    saveInStore('structures'),
  ]);

export default router;
