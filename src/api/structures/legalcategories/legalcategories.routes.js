import express from 'express';

import { validatePayload, setStructureIdFromRequestPath } from './legalcategories.middlewares';
import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { relationshipsRepository as repository } from '../../commons/repositories';
import { readQuery } from '../../commons/queries/object-legalcategories.queries';
import { structures as resource, legalcategories as subresource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}/:resourceId/${subresource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    validatePayload,
    createContext,
    setStructureIdFromRequestPath,
    setGeneratedInternalIdInContext(subresource),
    controllers.create(repository, readQuery),
    saveInStore(subresource),
  ]);

router.route(`/${resource}/:resourceId/${subresource}/:id`)
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(subresource),
  ])
  .get(controllers.read(repository, readQuery))
  .patch([
    validatePayload,
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore(subresource),
  ]);

export default router;
