import express from 'express';
import { patchContext, createContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { createGroupController, requireGroupRoles } from './groups.middlewares';
import readQuery from '../../commons/queries/groups.query';
import { groupsRepository as repository } from '../../commons/repositories';
import { groups as resource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext(resource),
    createGroupController,
    saveInStore(resource),
  ]);

router.route(`/${resource}/:id`)
  .get(controllers.read(repository, readQuery))
  .patch([
    requireGroupRoles(['admin', 'owner']),
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore(resource),
  ])
  .delete([
    requireGroupRoles(['owner']),
    patchContext,
    controllers.remove(repository),
    saveInStore(resource),
  ]);

export default router;
