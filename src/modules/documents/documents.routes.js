import express from 'express';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middleware';
import documents from './documents.resource';
import { createDocumentId, setFileInfo, saveFile, deleteFile, getFile } from './documents.middlewares';

const router = new express.Router();

router.route('/documents')
  .get(documents.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    createDocumentId,
    setFileInfo,
    saveFile,
    documents.controllers.create,
  ]);

router.route('/documents/:id')
  .get(documents.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    setFileInfo,
    saveFile,
    documents.controllers.patch,
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    deleteFile,
    documents.controllers.delete,
  ]);

router.route('/medias/documents/:filename')
  .get([requireActiveUser, getFile]);

export default router;
