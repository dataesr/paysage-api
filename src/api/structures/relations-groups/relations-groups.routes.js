import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { validatePayload } from './relations-groups.middlewares';
import readQuery from '../../commons/queries/relations-groups.query';
import { relationsGroupsRepository as repository } from '../../commons/repositories';
import { structures as resource, relationsGroups as subresource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}/:resourceId/${subresource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedInternalIdInContext(subresource),
    controllers.create(repository, readQuery),
    saveInStore(subresource),
  ]);

router.route(`/${resource}/:resourceId/${subresource}/:id`)
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore(subresource),
  ])
  .delete([
    patchContext,
    controllers.remove(repository),
    // TODO: delete relations associated
    saveInStore(subresource),
  ]);

export default router;
