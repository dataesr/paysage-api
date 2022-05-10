import express from 'express';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../../commons/middlewares/context.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import weblinks from './weblinks.resource';

const router = new express.Router();

router.route('/categories/:resourceId/weblinks')
  .get(weblinks.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    weblinks.controllers.create,
    saveInStore('categories'),
  ]);

router.route('/categories/:resourceId/weblinks/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    weblinks.controllers.delete,
    saveInStore('categories'),
  ])
  .get(weblinks.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    weblinks.controllers.patch,
    saveInStore('categories'),
  ]);

export default router;
