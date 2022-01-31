import express from 'express';
import Controllers from '../commons/controllers/base.controllers';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middleware';
import officialDocumentsRepository from './od.repository';

const officialDocumentControllers = new Controllers(officialDocumentsRepository);

const router = new express.Router();

router.route('/official-documents')
  .get(officialDocumentControllers.list)
  .post([
    requireActiveUser,
    createCtx,
    officialDocumentControllers.create,
  ]);

router.route('/official-documents/:id')
  .get(officialDocumentControllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    officialDocumentControllers.patch,
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    officialDocumentControllers.delete,
  ]);

export default router;
