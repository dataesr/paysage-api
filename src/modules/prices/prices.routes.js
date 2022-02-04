import express from 'express';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middleware';
import prices from './prices.resource';
import { validatePayload } from './prices.middlewares';

const router = new express.Router();

router.route('/prices')
  .get(prices.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    validatePayload,
    prices.controllers.create,
  ]);

router.route('/prices/:id')
  .get(prices.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    validatePayload,
    prices.controllers.patch,
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    prices.controllers.delete,
  ]);

export default router;
