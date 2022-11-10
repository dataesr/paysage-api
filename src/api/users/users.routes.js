import express from 'express';
import { patchContext } from '../commons/middlewares/context.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import { saveInElastic, saveInStore } from '../commons/middlewares/event.middlewares';
import { requireRoles } from '../commons/middlewares/rbac.middlewares';
import adminQuery from '../commons/queries/users.admin.query';
import elasticQuery from '../commons/queries/users.elastic';
import readQuery from '../commons/queries/users.query';
import { usersRepository as repository } from '../commons/repositories';
import { users as resource } from '../resources';
import { setConfirmToContext, notifyUser } from './users.middlewares';

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
    notifyUser,
    saveInStore(resource),
  ]);

router.route(`/admin/${resource}/:id`)
  .get([requireRoles(['admin']), controllers.read(repository, adminQuery, true)])
  .patch([
    requireRoles(['admin']),
    patchContext,
    controllers.patch(repository, adminQuery, true),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ])
  .delete([
    requireRoles(['admin']),
    patchContext,
    controllers.remove(repository),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ]);

export default router;
