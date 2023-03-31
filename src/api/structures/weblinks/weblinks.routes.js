import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { readQuery, readQueryWithLookup } from '../../commons/queries/weblinks.query';
import { weblinksRepository as repository } from '../../commons/repositories';
import { validatePayload } from './weblinks.middlewares';

const collection = 'structures';
const field = 'weblinks';

const router = new express.Router();

router.route(`/${collection}/:resourceId/${field}`)
  .get(controllers.list(repository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedInternalIdInContext(field),
    controllers.create(repository, readQueryWithLookup),
    saveInStore(field),
  ]);

router.route(`/${collection}/:resourceId/${field}/:id`)
  .get(controllers.read(repository, readQueryWithLookup))
  .patch([
    validatePayload,
    patchContext,
    controllers.patch(repository, readQueryWithLookup),
    saveInStore(field),
  ])
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(field),
  ]);

export default router;
