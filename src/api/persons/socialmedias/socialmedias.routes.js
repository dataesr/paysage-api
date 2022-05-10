import express from 'express';
import { createCtx, patchCtx } from '../../commons/middlewares/context.middleware';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import socialmedias from './socialmedias.resource';

const router = new express.Router();

router.route('/persons/:resourceId/socials')
  .get(socialmedias.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    socialmedias.controllers.create,
    saveInStore('persons'),
  ]);

router.route('/persons/:resourceId/socials/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    socialmedias.controllers.delete,
    saveInStore('persons'),
  ])
  .get(socialmedias.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    socialmedias.controllers.patch,
    saveInStore('persons'),
  ]);

export default router;
