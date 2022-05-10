import express from 'express';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middleware';
import { saveInStore } from '../commons/middlewares/event.middlewares';
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
    saveInStore('legal-categories'),
  ]);

router.route('/legalcategories/:id')
  .get(legalCategories.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    validatePayload,
    legalCategories.controllers.patch,
    saveInStore('legal-categories'),
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    legalCategories.controllers.delete,
    saveInStore('legal-categories'),
  ]);

export default router;
