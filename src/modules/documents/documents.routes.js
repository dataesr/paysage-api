import express from 'express';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middleware';
import documents from './documents.resource';
import { createFileInfo, updateFileInfo, saveFile, deleteFile } from './documents.middlewares';

const router = new express.Router();

router.route('/documents')
  .get(documents.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    createFileInfo,
    saveFile,
    documents.controllers.create,
  ]);

router.route('/documents/:id')
  .get(documents.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    updateFileInfo,
    saveFile,
    documents.controllers.patch,
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    deleteFile,
    documents.controllers.delete,
  ]);

export default router;
