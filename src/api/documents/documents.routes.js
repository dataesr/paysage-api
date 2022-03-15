import express from 'express';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx, setGeneratedObjectIdInContext } from '../commons/middlewares/context.middleware';
import documents from './documents.resource';
import { setFileInfo, saveFile, deleteFile } from './documents.middlewares';

const router = new express.Router();

router.route('/documents')
  .get(documents.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    setGeneratedObjectIdInContext('documents'),
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

export default router;
