import express from 'express';
import Controllers from '../commons/controllers/base.controllers';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middleware';
import pricesRepository from './prices.repository';
import { validatePayload } from './prices.middlewares';

const pricesControllers = new Controllers(pricesRepository);

const router = new express.Router();

router.route('/prices')
  .get(pricesControllers.list)
  .post([
    requireActiveUser,
    createCtx,
    validatePayload,
    pricesControllers.create,
  ]);

router.route('/prices/:id')
  .get(pricesControllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    validatePayload,
    pricesControllers.patch,
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    pricesControllers.delete,
  ]);

export default router;
