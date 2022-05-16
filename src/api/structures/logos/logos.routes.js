import express from 'express';
import { patchContext, createContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middleware';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import repository from './logos.repository';
import { setFileInfo, saveFile, deleteFile } from './logos.middlewares';
import config from '../structures.config';
import controllers from '../../commons/middlewares/crud-nested.middlewares';
import { readQuery } from './logos.queries';

const { collectionName, logosField } = config;
const collectionField = `${collectionName}-${logosField}`;

const router = new express.Router();

router.route(`/${collectionName}/:resourceId/${logosField}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext(collectionField),
    setFileInfo,
    saveFile,
    controllers.create(repository, readQuery),
    saveInStore(collectionField),
  ]);

router.route(`/${collectionName}/:resourceId/${logosField}/:id`)
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
