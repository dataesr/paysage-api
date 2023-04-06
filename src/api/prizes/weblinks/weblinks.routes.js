import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { readQuery, readQueryWithLookup } from '../../commons/queries/weblinks.query';
import { weblinksRepository as repository } from '../../commons/repositories';
import { prizes as resource, weblinks as subresource } from '../../resources';
import { validatePayload } from './weblinks.middlewares';

const router = new express.Router();

router.route(`/${resource}/:resourceId/${subresource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedInternalIdInContext(subresource),
    controllers.create(repository, readQueryWithLookup),
    saveInStore(subresource),
  ]);

router.route(`/${resource}/:resourceId/${subresource}/:id`)
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(subresource),
  ])
  .get(controllers.read(repository, readQueryWithLookup))
  .patch([
    validatePayload,
    patchContext,
    controllers.patch(repository, readQueryWithLookup),
    saveInStore(subresource),
  ]);

export default router;
