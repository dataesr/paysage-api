import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { readQuery, readQueryWithLookup } from '../../commons/queries/social-medias.query';
import { socialmediasRepository as repository } from '../../commons/repositories';
import { categories as resource, socialmedias as subresource } from '../../resources';
import { validatePayload } from './social-medias.middlewares';

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
  .get(controllers.read(repository, readQueryWithLookup))
  .patch([
    patchContext,
    controllers.patch(repository, readQueryWithLookup),
    saveInStore(subresource),
  ])
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(subresource),
  ]);

export default router;
