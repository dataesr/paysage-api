import express from 'express';
import { patchContext, createContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import repository from './logos.repository';
import { setFileInfo, saveFile, deleteFile } from './logos.middlewares';
import config from '../structures.config';
import controllers from '../../commons/middlewares/crud-nested.middlewares';
import { readQuery } from './logos.queries';

const { collection, logosField: field } = config;
const collectionField = `${collection}-${field}`;

const router = new express.Router();

router.route(`/${collection}/:resourceId/${field}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext(collectionField),
    setFileInfo,
    saveFile,
    controllers.create(repository, readQuery),
    saveInStore(collectionField),
  ]);

router.route(`/${collection}/:resourceId/${field}/:id`)
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
