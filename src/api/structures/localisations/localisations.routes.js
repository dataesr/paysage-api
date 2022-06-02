import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import controllers from '../../commons/middlewares/crud-nested.middlewares';
import { readQuery } from './localisations.queries';
import { setGeoJSON, validatePhoneNumber } from './localisations.middlewares';
import repository from './localisations.repository';
import config from '../structures.config';

const { collection, localisationsField: field } = config;
const collectionField = `${collection}-${field}`;

const router = new express.Router();

router.route(`/${collection}/:resourceId/${field}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeoJSON,
    validatePhoneNumber,
    setGeneratedInternalIdInContext(collectionField),
    controllers.create(repository, readQuery),
    saveInStore(collectionField),
  ]);

router.route(`/${collection}/:resourceId/${field}/:id`)
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(collectionField),
  ])
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    setGeoJSON,
    validatePhoneNumber,
    controllers.patch(repository, readQuery),
    saveInStore(collectionField),
  ]);

export default router;
