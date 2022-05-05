import express from 'express';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middleware';
import validatePayload from './middlewares/validate-payload';
import createPrice from './middlewares/create-price';
import getPrice from './middlewares/get-price';
import patchPrice from './middlewares/patch-price';
import listPrices from './middlewares/list-prices';
import deletePrice from './middlewares/delete-price';
import generateId from './middlewares/generate-id';
import existsOr404 from './middlewares/exists-or-404';

const router = new express.Router();

router.route('/prices')
  .get([
    requireActiveUser,
    listPrices,
  ])
  .post([
    requireActiveUser,
    validatePayload,
    createCtx,
    generateId,
    createPrice,
    getPrice,
    // storeEvent,
    // indexWhatever
  ]);

router.route('/prices/:id')
  .get([
    requireActiveUser,
    getPrice,
  ])
  .patch([
    requireActiveUser,
    existsOr404,
    patchCtx,
    validatePayload,
    patchPrice,
    getPrice,
    // storeEvent,
    // indexWhatever
  ])
  .delete([
    requireActiveUser,
    existsOr404,
    deletePrice,
    // storeEvent,
    // unindexWhatever
  ]);

export default router;
