import express from 'express';
import { patchContext, createContext, setGeneratedObjectIdInContext } from '../commons/middlewares/context.middleware';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import { validatePayload } from '../commons/middlewares/validate.middlewares';

import { readQuery } from './officialdocuments.queries';
import officialDocumentsRepository from './officialdocuments.repository';
import config from './officialdocuments.config';

const { collectionName } = config;

const router = new express.Router();

router.route('/officialdocuments')
  .get(controllers.list(officialDocumentsRepository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedObjectIdInContext(collectionName),
    controllers.create(officialDocumentsRepository, readQuery),
    saveInStore(collectionName),
  ]);

router.route('/officialdocuments/:id')
  .get(controllers.read(officialDocumentsRepository, readQuery))
  .patch([
    validatePayload,
    patchContext,
    controllers.patch(officialDocumentsRepository, readQuery),
    saveInStore(collectionName),
  ])
  .delete([
    patchContext,
    controllers.remove(officialDocumentsRepository),
    saveInStore(collectionName),
  ]);

export default router;
