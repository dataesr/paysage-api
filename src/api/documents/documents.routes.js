import express from 'express';

import { patchContext, createContext, setGeneratedInternalIdInContext } from '../commons/middlewares/context.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import readQuery from '../commons/queries/documents.query';
import { documentsRepository as repository } from '../commons/repositories';
import { forbidUnauthorizedUser, setViewerFilter, validatePayload } from './documents.middlewares';
import { documents as resource } from '../resources';

const router = new express.Router();

router.route(`/${resource}`)
  .get([
    setViewerFilter,
    controllers.list(repository, readQuery),
  ])
  .post([
    validatePayload,
    createContext,
    setGeneratedInternalIdInContext(resource),
    controllers.create(repository, readQuery),
    saveInStore(resource),
  ]);

router.route(`/${resource}/:id`)
  .get([
    forbidUnauthorizedUser,
    controllers.read(repository, readQuery),
  ])
  .patch([
    setViewerFilter,
    validatePayload,
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore(resource),
  ])
  .delete([
    forbidUnauthorizedUser,
    patchContext,
    controllers.remove(repository, readQuery),
    saveInStore(resource),
  ]);

export default router;
