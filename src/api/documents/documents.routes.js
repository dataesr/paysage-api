import express from 'express';
import { patchContext, createContext, setGeneratedObjectIdInContext } from '../commons/middlewares/context.middleware';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import { setFileInfo, saveFile, deleteFile } from './documents.middlewares';

import { readQuery } from './documents.queries';
import pricesRepository from './documents.repository';
import config from './documents.config';

const router = new express.Router();

router.route('/documents')
  .get(controllers.list(pricesRepository, readQuery))
  .post([
    createContext,
    setGeneratedObjectIdInContext(config.collectionName),
    setFileInfo,
    saveFile,
    controllers.create(pricesRepository, readQuery),
    saveInStore('documents'),
  ]);

router.route('/documents/:id')
  .get(controllers.read(pricesRepository, readQuery))
  .patch([
    patchContext,
    setFileInfo,
    saveFile,
    controllers.patch(pricesRepository, readQuery),
    saveInStore('documents'),
  ])
  .delete([
    patchContext,
    deleteFile,
    controllers.remove(pricesRepository, readQuery),
    saveInStore('documents'),
  ]);

export default router;
