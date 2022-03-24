import express from 'express';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middleware';
import officialDocuments from './od.resource';

const router = new express.Router();

router.route('/officialdocuments')
  .get(officialDocuments.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    officialDocuments.controllers.create,
  ]);

router.route('/officialdocuments/:id')
  .get(officialDocuments.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    officialDocuments.controllers.patch,
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    officialDocuments.controllers.delete,
  ]);

export default router;
