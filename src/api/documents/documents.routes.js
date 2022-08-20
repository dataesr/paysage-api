import express from 'express';
import { patchContext, createContext, setGeneratedInternalIdInContext } from '../commons/middlewares/context.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import { setFileInfo, saveFile, deleteFile } from '../commons/middlewares/files.middlewares';
import { documentsRepository as repository } from '../commons/repositories';
import readQuery from '../commons/queries/documents.query';
import { validatePayload } from './documents.middlewares';
import { documents as resource } from '../resources';

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
    validatePayload,
    patchContext,
    setFileInfo(resource),
    saveFile,
    controllers.patch(repository, readQuery),
    saveInStore(resource),
  ])
  .delete([
    patchContext,
    deleteFile(resource),
    controllers.remove(repository, readQuery),
    saveInStore(resource),
  ]);

export default router;
