import express from 'express';
import { createCtx, patchCtx } from '../../commons/middlewares/context.middleware';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import weblinks from './weblinks.resource';

const router = new express.Router();

router.route('/persons/:resourceId/weblinks')
  .get(weblinks.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    weblinks.controllers.create,
    saveInStore('persons'),
  ]);

router.route('/persons/:resourceId/weblinks/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    weblinks.controllers.delete,
    saveInStore('persons'),
  ])
  .get(weblinks.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    weblinks.controllers.patch,
    saveInStore('persons'),
  ]);

export default router;
