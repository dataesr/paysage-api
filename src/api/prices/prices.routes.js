import express from 'express';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middleware';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import prices from './prices.resource';
import { validatePayload } from './prices.middlewares';

const router = new express.Router();

router.route('/prices')
  .get(prices.controllers.list)
  .post([
    // requireActiveUser,
    validatePayload,
    createCtx,
    prices.controllers.create,
    saveInStore('prices'),
  ]);

router.route('/prices/:id')
  .get(prices.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    validatePayload,
    prices.controllers.patch,
    saveInStore('prices'),
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    prices.controllers.delete,
    saveInStore('prices'),
  ]);

export default router;
