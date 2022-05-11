import express from 'express';
import { patchContext, createContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middleware';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import repository from './logos.repository';
import { setFileInfo, saveFile, deleteFile } from './logos.middlewares';
import config from '../structures.config';
import controllers from '../../commons/middlewares/crud-nested.middlewares';
import { readQuery } from './logos.queries';

const router = new express.Router();
const collectionField = `${config.collectionName}-${config.logosField}`;

router.route('/structures/:resourceId/logos')
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext(collectionField),
    setFileInfo,
    saveFile,
    controllers.create(repository, readQuery),
    saveInStore(collectionField),
  ]);

router.route('/structures/:resourceId/logos/:id')
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    setFileInfo,
    saveFile,
    controllers.patch(repository, readQuery),
    saveInStore(collectionField),
  ])
  .delete([
    patchContext,
    deleteFile,
    controllers.remove(repository),
    saveInStore(collectionField),
  ]);

export default router;
