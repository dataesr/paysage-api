import express from 'express';
import { patchContext, createContext, setGeneratedInternalIdInContext } from '../commons/middlewares/context.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import { setFileInfo, saveFile, deleteFile } from '../commons/middlewares/files.middlewares';
import { followUpsRepository as repository } from '../commons/repositories';
import readQuery from '../commons/queries/followups.query';
import { canUserEdit, validatePayload } from './followups.middlewares';
import { followups as resource } from '../resources';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedInternalIdInContext(resource),
    setFileInfo(resource),
    saveFile,
    controllers.create(repository, readQuery),
    saveInStore(resource),
  ]);

router.route(`/${resource}/:id`)
  .get(controllers.read(repository, readQuery))
  .patch([
    canUserEdit,
    validatePayload,
    patchContext,
    setFileInfo(resource),
    saveFile,
    controllers.patch(repository, readQuery),
    saveInStore(resource),
  ])
  .delete([
    canUserEdit,
    patchContext,
    deleteFile(resource),
    controllers.remove(repository, readQuery),
    saveInStore(resource),
  ]);

export default router;
