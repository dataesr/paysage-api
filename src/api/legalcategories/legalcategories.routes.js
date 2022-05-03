import express from 'express';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middleware';
import legalCategories from './legalcategories.resource';
import { validatePayload } from './legalcategories.middlewares';

const router = new express.Router();

router.route('/legalcategories')
  .get(legalCategories.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    validatePayload,
    legalCategories.controllers.create,
  ]);

router.route('/legalcategories/:id')
  .get(legalCategories.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    validatePayload,
    legalCategories.controllers.patch,
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    legalCategories.controllers.delete,
  ]);

export default router;
