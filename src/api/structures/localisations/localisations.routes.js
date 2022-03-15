import express from 'express';
import { createCtx, patchCtx } from '../../commons/middlewares/context.middleware';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { setGeoJSON, validatePhoneNumber } from './localisations.middlewares';
import localisations from './localisations.resource';

const router = new express.Router();

// LOCALISATIONS
router.route('/structures/:rid/localisations')
  .get(localisations.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    setGeoJSON,
    validatePhoneNumber,
    localisations.controllers.create,
  ]);

router.route('/structures/:rid/localisations/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    localisations.controllers.delete,
  ])
  .get(localisations.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    setGeoJSON,
    validatePhoneNumber,
    localisations.controllers.patch,
  ]);

export default router;
