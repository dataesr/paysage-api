import express from 'express';
import { createCtx } from '../../commons/middlewares/context.middleware';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import relations from './categories.resource';

const router = new express.Router();

router.route('/:parentCollection/:parentId/:childCollection')
  .get(relations.controllers.list)

router.route('/:childCollection/:childId/:parentCollection')
  .get(relations.controllers.list)

router.route('/:parentCollection/:parentId/:childCollection/:childId')
  .get([
    requireActiveUser,
    createCtx,
    relations.controllers.get,
  ])
  .post([
    requireActiveUser,
    createCtx,
    relations.controllers.post,
  ])
  .delete([
    requireActiveUser,
    createCtx,
    relations.controllers.delete,
  ])
  .patch([
    requireActiveUser,
    createCtx,
    relations.controllers.patch,
  ])

export default router;
