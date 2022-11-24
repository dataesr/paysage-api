import express from 'express';

import { createContext, patchContext, setPutIdInContext, setGeneratedInternalIdInContext } from '../commons/middlewares/context.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import { validatePayload } from './relations-groups.middlewares';
import readQuery from '../commons/queries/relations-groups.query';
import { relationsGroupsRepository as repository } from '../commons/repositories';
import { relationsGroups as resource } from '../resources';

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
    controllers.patch(repository, readQuery),
    saveInStore(resource),
  ])
  .put([
    validatePayload,
    createContext,
    setPutIdInContext(resource),
    controllers.create(repository, readQuery),
    saveInStore(resource),
  ])
  .delete([
    patchContext,
    controllers.remove(repository),
    // TODO: delete relations associated
    saveInStore(resource),
  ]);

export default router;
