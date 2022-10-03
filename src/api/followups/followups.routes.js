import express from 'express';
import { patchContext, createContext, setGeneratedInternalIdInContext } from '../commons/middlewares/context.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import { followUpsRepository as repository } from '../commons/repositories';
import readQuery from '../commons/queries/followups.query';
import { validatePayload } from './followups.middlewares';
import { followups as resource } from '../resources';

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
    // TODO: canUserEdit,
    validatePayload,
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore(resource),
  ])
  .delete([
    // TODO: canUserEdit,
    patchContext,
    controllers.remove(repository, readQuery),
    saveInStore(resource),
  ]);

export default router;
