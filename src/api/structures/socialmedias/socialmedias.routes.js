import express from 'express';
import { createCtx, patchCtx } from '../../commons/middlewares/context.middlewares';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import socialmedias from './socialmedias.resource';

const router = new express.Router();

router.route('/structures/:resourceId/socials')
  .get(socialmedias.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    socialmedias.controllers.create,
    saveInStore('structures'),
  ]);

router.route('/structures/:resourceId/socials/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    socialmedias.controllers.delete,
    saveInStore('structures'),
  ])
  .get(socialmedias.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    socialmedias.controllers.patch,
    saveInStore('structures'),
  ]);

export default router;
