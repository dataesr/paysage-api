import express from 'express';

import { patchContext, createContext, setGeneratedInternalIdInContext } from '../commons/middlewares/context.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import readQuery from '../commons/queries/relation-types.query';
import { relationTypesRepository as repository } from '../commons/repositories';
import { relationTypes as resource } from '../resources';
// import { canIDelete } from './relationtypes.middlewares';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository, readQuery))
  .post([
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
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(resource),
  ]);

export default router;
