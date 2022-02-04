import express from 'express';
import { createCtx, patchCtx } from '../commons/middlewares/context.middleware';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import structures from './root/root.resource';
import status from './status/status.resource';
import names from './names/names.resource';
import identifiers from './identifiers/identifiers.resource';
import { validateStatusPayload } from './status/status.middlewares';

const router = new express.Router();
// const namesControllers = new Controllers(namesRepository);

// STUCTURES
router.route('/structures')
  .get(structures.controllers.list)
  .post(requireActiveUser, createCtx, structures.controllers.create);

router.route('/structures/:id')
  .get(structures.controllers.read)
  .patch(requireActiveUser, patchCtx, structures.controllers.patch)
  .delete(requireActiveUser, patchCtx, structures.controllers.delete);

// STATUSES
router.route('/structures/:id/status')
  .put(requireActiveUser, patchCtx, validateStatusPayload, status.controllers.patch);

// NAMES
router.route('/structures/:rid/names')
  .get(names.controllers.list)
  .post(requireActiveUser, createCtx, names.controllers.create);
router.route('/structures/:rid/names/:id')
  .delete(requireActiveUser, patchCtx, names.controllers.delete)
  .get(names.controllers.read)
  .patch(requireActiveUser, patchCtx, names.controllers.patch);

// IDENTIFIERS
router.route('/structures/:rid/identifiers')
  .get(identifiers.controllers.list)
  .post(requireActiveUser, createCtx, identifiers.controllers.create);
router.route('/structures/:rid/identifiers/:id')
  .delete(requireActiveUser, patchCtx, identifiers.controllers.delete)
  .get(identifiers.controllers.read)
  .patch(requireActiveUser, patchCtx, identifiers.controllers.patch);

// // LOCALISATIONS
// router.route('/structures/:structureId/localisations')
//   .get(localisationsControllers.list)
//   .post(localisationsControllers.create);
// router.route('/structures/:structureId/localisations/:localisationId')
//   .delete(localisationsControllers.delete)
//   .get(localisationsControllers.read)
//   .patch(localisationsControllers.patch);

export default router;
