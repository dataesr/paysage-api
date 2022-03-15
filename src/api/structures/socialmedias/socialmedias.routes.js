import express from 'express';
import { createCtx, patchCtx } from '../../commons/middlewares/context.middleware';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import socialmedias from './socialmedias.resource';

const router = new express.Router();

router.route('/structures/:rid/socials')
  .get(socialmedias.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    socialmedias.controllers.create,
  ]);

router.route('/structures/:rid/socials/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    socialmedias.controllers.delete,
  ])
  .get(socialmedias.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    socialmedias.controllers.patch,
  ]);

export default router;
