import express from 'express';
import { patchContext, createContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { createGroupMemberController } from './members.middlewares';
import readQuery from '../../commons/queries/usersgroups.query';
import { usersGroupMembersRepository as repository } from '../../commons/repositories';
import { usersGroups as resource, usersGroupMembers as subresource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}/:resourceId/${subresource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext(resource),
    createGroupMemberController,
    saveInStore(resource),
  ]);

router.route(`/${resource}/:resourceId/${subresource}/:id`)
  .patch([
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore(resource),
  ])
  .delete([
    patchContext,
    // remove membership logic
    controllers.remove(repository),
    saveInStore(resource),
  ]);

export default router;
