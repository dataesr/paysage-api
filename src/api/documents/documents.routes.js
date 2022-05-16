import express from 'express';
import { patchContext, createContext, setGeneratedObjectIdInContext } from '../commons/middlewares/context.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import { setFileInfo, saveFile, deleteFile } from './documents.middlewares';

import { readQuery } from './documents.queries';
import pricesRepository from './documents.repository';
import config from './documents.config';

const { collection } = config;

const router = new express.Router();

router.route(`/${collection}`)
  .get(controllers.list(pricesRepository, readQuery))
  .post([
    createContext,
    setGeneratedObjectIdInContext(collection),
    setFileInfo,
    saveFile,
    controllers.create(pricesRepository, readQuery),
    saveInStore(collection),
  ]);

router.route(`/${collection}/:id`)
  .get(controllers.read(pricesRepository, readQuery))
  .patch([
    patchContext,
    setFileInfo,
    saveFile,
    controllers.patch(pricesRepository, readQuery),
    saveInStore(collection),
  ])
  .delete([
    patchContext,
    deleteFile,
    controllers.remove(pricesRepository, readQuery),
    saveInStore(collection),
  ]);

export default router;
