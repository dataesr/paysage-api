import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../middlewares/context.middlewares';
import { saveInStore } from '../middlewares/event.middlewares';
import controllers from '../middlewares/crud.middlewares';
import repository from './identifiers.repository';
import { readQuery } from './identifiers.queries';

const collection = 'persons';

const router = new express.Router();

router.route(`/${collection}/:resourceId/identifiers`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext('identifiers'),
    controllers.create(repository, readQuery),
    saveInStore('identifiers'),
  ]);

router.route(`/${collection}/:resourceId/identifiers/:id`)
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore('identifiers'),
  ])
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore('identifiers'),
  ]);

export default router;
