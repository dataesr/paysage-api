import express from 'express';
import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middleware';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { validatePayload } from './categories.middlewares';
import repository from './categories.repository';
import config from '../structures.config';
import controllers from '../../commons/middlewares/crud-nested.middlewares';
import { readQuery } from './categories.queries';

const { categoriesField, collectionName } = config;
const collectionField = `${collectionName}-${categoriesField}`;

const router = new express.Router();

router.route(`/${collectionName}/:resourceId/${categoriesField}`)
  .get(controllers.list(repository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedInternalIdInContext(collectionField),
    controllers.create(repository, readQuery),
    saveInStore(collectionField),
  ]);

router.route(`/${collectionName}/:resourceId/${categoriesField}/:id`)
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(collectionField),
  ])
  .get(controllers.read(repository, readQuery))
  .patch([
    validatePayload,
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore(collectionField),
  ]);

export default router;
