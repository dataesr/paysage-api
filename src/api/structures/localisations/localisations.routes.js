import express from 'express';
import { createCtx, patchCtx } from '../../commons/middlewares/context.middleware';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { setGeoJSON, validatePhoneNumber } from './localisations.middlewares';
import localisations from './localisations.resource';

const router = new express.Router();

router.route('/structures/:resourceId/localisations')
  .get(localisations.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    setGeoJSON,
    validatePhoneNumber,
    localisations.controllers.create,
    saveInStore('structures'),
  ]);

router.route('/structures/:resourceId/localisations/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    localisations.controllers.delete,
    saveInStore('structures'),
  ])
  .get(localisations.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    setGeoJSON,
    validatePhoneNumber,
    localisations.controllers.patch,
    saveInStore('structures'),
  ]);

export default router;
