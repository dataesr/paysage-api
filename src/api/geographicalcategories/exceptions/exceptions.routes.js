import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { readQuery } from '../../commons/queries/exceptions.query';
import { geographicalCategoriesExceptionsRepository as repository } from '../../commons/repositories';
import { geographicalExceptions as resource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}`)
  .post([
    createContext,
    setGeneratedInternalIdInContext(resource),
    controllers.create(repository, readQuery),
    saveInStore(resource),
  ]);

router.route(`/${resource}/:id`)
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(resource),
  ]);

export default router;
