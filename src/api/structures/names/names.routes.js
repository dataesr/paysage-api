import express from 'express';
import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middleware';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import controllers from '../../commons/middlewares/crud-nested.middlewares';
import repository from './names.repository';
import { readQuery } from './names.queries';
import config from '../structures.config';

const { collectionName, namesField } = config;
const collectionField = `${collectionName}-${namesField}`;

const router = new express.Router();

router.route(`/${collectionName}/:resourceId/${namesField}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext(collectionField),
    controllers.create(repository, readQuery),
    saveInStore(collectionField),
  ]);

router.route(`/${collectionName}/:resourceId/${namesField}/:id`)
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(collectionField),
  ])
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore(collectionField),
  ]);

export default router;
