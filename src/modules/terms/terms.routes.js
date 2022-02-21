import express from 'express';
import terms from './terms.resource';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middleware';
import { validatePayload } from './terms.middlewares';

const router = new express.Router();

router.route('/terms')
  .get(terms.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    validatePayload,
    terms.controllers.create,
  ]);

router.route('/terms/:id')
  .get(terms.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    validatePayload,
    terms.controllers.patch,
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    terms.controllers.delete,
  ]);

export default router;
