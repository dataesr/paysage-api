import express from 'express';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import {
  requireGroupRoles,
  addUserToGroupController,
  deleteUserFromGroupController,
  getMembersController,
} from './members.middlewares';
import { groups as resource, groupMembers as subresource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}/:groupId/${subresource}`)
  .get(getMembersController);

router.route(`/${resource}/:groupId/${subresource}/:userId`)
  .put([
    requireGroupRoles(['owner', 'admin']),
    addUserToGroupController,
    saveInStore(subresource),
  ])
  .delete([
    requireGroupRoles(['owner', 'admin']),
    deleteUserFromGroupController,
    saveInStore(subresource),
  ]);

export default router;
