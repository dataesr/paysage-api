import express from 'express';
import terms from './terms.resource';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middleware';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import { validatePayload } from './terms.middlewares';

const router = new express.Router();

router.route('/terms')
  .get(terms.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    validatePayload,
    terms.controllers.create,
    saveInStore('terms'),
  ]);

router.route('/terms/:id')
  .get(terms.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    validatePayload,
    terms.controllers.patch,
    saveInStore('terms'),
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    terms.controllers.delete,
    saveInStore('terms'),
  ]);

export default router;
