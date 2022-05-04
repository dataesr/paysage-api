import express from 'express';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middleware';
import logos from './logos.resource';
import { setFileInfo, saveFile, deleteFile } from './logos.middlewares';

const router = new express.Router();

router.route('/structures/:resourceId/logos')
  .get(logos.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    setGeneratedInternalIdInContext('structures'),
    setFileInfo,
    saveFile,
    logos.controllers.create,
  ]);

router.route('/structures/:resourceId/logos/:id')
  .get(logos.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    setFileInfo,
    saveFile,
    logos.controllers.patch,
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    deleteFile,
    logos.controllers.delete,
  ]);

export default router;
