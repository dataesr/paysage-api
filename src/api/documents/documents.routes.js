import express from 'express';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx, setGeneratedObjectIdInContext } from '../commons/middlewares/context.middleware';
import { saveInStore } from '../commons/middlewares/event.middlewares';
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
    saveInStore('documents'),
  ]);

router.route('/documents/:id')
  .get(documents.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    setFileInfo,
    saveFile,
    documents.controllers.patch,
    saveInStore('documents'),
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    deleteFile,
    documents.controllers.delete,
    saveInStore('documents'),
  ]);

export default router;
