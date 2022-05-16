import express from 'express';
import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middleware';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import repository from './socialmedias.repository';
import config from '../persons.config';
import controllers from '../../commons/middlewares/crud-nested.middlewares';
import { readQuery } from './socialmedias.queries';

const { collectionName, socialMediasField } = config;
const collectionField = `${collectionName}-${socialMediasField}`;

const router = new express.Router();

router.route(`/${collectionName}/:resourceId/${socialMediasField}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext(collectionField),
    controllers.create(repository, readQuery),
    saveInStore(collectionField),
  ]);

router.route(`/${collectionName}/:resourceId/${socialMediasField}/:id`)
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
