import express from 'express';
import { db } from '../../services/mongo.service';
import BaseMongoRepository from '../commons/repositories/base.mongo.repository';
import { patchContext, createContext, setGeneratedInternalIdInContext } from '../commons/middlewares/context.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import { setFileInfo, saveFile, deleteFile } from './documents.middlewares';

import { readQuery } from './documents.queries';

const collection = 'documents';
const documentsRepository = new BaseMongoRepository({ db, collection });

const router = new express.Router();

router.route(`/${collection}`)
  .get(controllers.list(documentsRepository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext(collection),
    setFileInfo,
    saveFile,
    controllers.create(documentsRepository, readQuery),
    saveInStore(collection),
  ]);

router.route(`/${collection}/:id`)
  .get(controllers.read(documentsRepository, readQuery))
  .patch([
    patchContext,
    setFileInfo,
    saveFile,
    controllers.patch(documentsRepository, readQuery),
    saveInStore(collection),
  ])
  .delete([
    patchContext,
    deleteFile,
    controllers.remove(documentsRepository, readQuery),
    saveInStore(collection),
  ]);

export default router;
