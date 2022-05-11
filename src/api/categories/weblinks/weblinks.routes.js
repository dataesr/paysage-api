import express from 'express';
import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middleware';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { readQuery } from './weblinks.queries';
import repository from './weblinks.respository';
import config from '../categories.config';
import controllers from '../../commons/middlewares/crud-nested.middlewares';

const router = new express.Router();
const collectionField = `${config.collectionName}-${config.weblinksField}`;

router.route('/categories/:resourceId/weblinks')
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext(collectionField),
    controllers.create(repository, readQuery),
    saveInStore(collectionField),
  ]);

router.route('/categories/:resourceId/weblinks/:id')
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
