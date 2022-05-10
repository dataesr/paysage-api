import express from 'express';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import officialDocuments from './officialdocuments.resource';

const router = new express.Router();

router.route('/officialdocuments')
  .get(officialDocuments.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    officialDocuments.controllers.create,
    saveInStore('official-documents'),
  ]);

router.route('/officialdocuments/:id')
  .get(officialDocuments.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    officialDocuments.controllers.patch,
    saveInStore('official-documents'),
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    officialDocuments.controllers.delete,
    saveInStore('official-documents'),
  ]);

export default router;
