import express from 'express';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../../commons/middlewares/context.middleware';
import persons from './root.resource';

const router = new express.Router();

router.route('/persons')
  .get(persons.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    persons.controllers.create,
  ]);

router.route('/persons/:id')
  .get(persons.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    persons.controllers.patch,
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    persons.controllers.delete,
  ]);

export default router;
