import express from 'express';
import { patchContext, createContext, setGeneratedInternalIdInContext, setPutIdInContext } from '../commons/middlewares/context.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import { validatePayload, canDelete } from './document-types.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import readQuery from '../commons/queries/document-types.query';
import { documentTypesRepository as repository } from '../commons/repositories';
import { documentTypes as resource } from '../resources';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedInternalIdInContext(resource),
    controllers.create(repository, readQuery),
    saveInStore(resource),
  ]);

router.route(`/${resource}/:id`)
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    validatePayload,
    controllers.patch(repository, readQuery),
    saveInStore(resource),
  ])
  .delete([
    canDelete,
    patchContext,
    controllers.remove(repository),
    saveInStore(resource),
  ])
  .put([
    createContext,
    setPutIdInContext(resource),
    controllers.create(repository, readQuery),
    saveInStore(resource),
  ]);

export default router;
