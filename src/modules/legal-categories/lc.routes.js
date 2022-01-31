import express from 'express';
import Controllers from '../commons/controllers/base.controllers';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middleware';
import legalCategoriesRepository from './lc.repository';
import { validatePayload } from './lc.middlewares';

const pricesControllers = new Controllers(legalCategoriesRepository);

const router = new express.Router();

router.route('/legal-categories')
  .get(pricesControllers.list)
  .post([
    requireActiveUser,
    createCtx,
    validatePayload,
    pricesControllers.create,
  ]);

router.route('/legal-categories/:id')
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
