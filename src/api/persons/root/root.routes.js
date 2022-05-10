import express from 'express';

import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../../commons/middlewares/context.middleware';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import persons from './root.resource';

const router = new express.Router();

router.route('/persons')
  .get(persons.controllers.list)
  .post([
    (req, res, next) => next(),
    requireActiveUser,
    createCtx,
    persons.controllers.create,
    saveInStore('persons'),
  ]);

router.route('/persons/:id')
  .get(persons.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    persons.controllers.patch,
    saveInStore('persons'),
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    persons.controllers.delete,
    saveInStore('persons'),
  ]);

export default router;
