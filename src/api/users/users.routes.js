import express from 'express';
import { patchContext } from '../commons/middlewares/context.middlewares';
import { requireRoles } from '../commons/middlewares/rbac.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';

import readQuery from '../commons/queries/users.query';
import adminQuery from '../commons/queries/users.admin.query';
import { setConfirmToContext } from './users.middlewares';
import { usersRepository as repository } from '../commons/repositories';
import { users as resource } from '../resources';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository, readQuery));

router.route(`/admin/${resource}`)
  .get([
    requireRoles(['admin']),
    controllers.list(repository, adminQuery, true),
  ]);

router.route(`/admin/${resource}/:id/confirm`)
  .put([
    requireRoles(['admin']),
    patchContext,
    setConfirmToContext,
    controllers.patch(repository, adminQuery),
    saveInStore(resource),
  ]);

router.route(`/admin/${resource}/:id`)
  .get([requireRoles(['admin']), controllers.read(repository, adminQuery, true)])
  .patch([
    requireRoles(['admin']),
    patchContext,
    controllers.patch(repository, adminQuery, true),
    saveInStore(resource),
  ])
  .delete([
    requireRoles(['admin']),
    patchContext,
    controllers.remove(repository),
    saveInStore(resource),
  ]);

export default router;
