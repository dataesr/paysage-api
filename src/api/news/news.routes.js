import express from 'express';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middleware';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import news from './news.resource';

const router = new express.Router();

router.route('/news')
  .get(news.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    news.controllers.create,
    saveInStore('news'),
  ]);

router.route('/news/:id')
  .get(news.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    news.controllers.patch,
    saveInStore('news'),
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    news.controllers.delete,
    saveInStore('news'),
  ]);

export default router;
