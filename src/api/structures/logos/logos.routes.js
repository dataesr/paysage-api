import express from 'express';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
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
    saveInStore('structures'),
  ]);

router.route('/structures/:resourceId/logos/:id')
  .get(logos.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    setFileInfo,
    saveFile,
    logos.controllers.patch,
    saveInStore('structures'),
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    deleteFile,
    logos.controllers.delete,
    saveInStore('structures'),
  ]);

export default router;
