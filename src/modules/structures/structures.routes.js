import express from 'express';
import { createCtx, patchCtx } from '../commons/middlewares/context.middleware';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import structures from './root/root.resource';
import status from './status/status.resource';
import names from './names/names.resource';
import identifiers from './identifiers/identifiers.resource';
import localisations from './localisations/localisations.resource';
import weblinks from './weblinks/weblinks.resource';
import socialmedias from './socialmedias/socialmedias.resource';
import { validateStatusPayload } from './status/status.middlewares';
import { setCreationDefaultValues, setPutIdInContext } from './root/root.middlewares';

const router = new express.Router();
// const namesControllers = new Controllers(namesRepository);

// STUCTURES
router.route('/structures')
  .get(structures.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    setCreationDefaultValues,
    structures.controllers.create,
  ]);

router.route('/structures/:id')
  .get(structures.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    structures.controllers.patch,
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    structures.controllers.delete,
  ])
  .put([
    requireActiveUser,
    createCtx,
    setPutIdInContext,
    setCreationDefaultValues,
    structures.controllers.create,
  ]);

// STATUSES
router.route('/structures/:id/status')
  .put([
    requireActiveUser,
    patchCtx,
    validateStatusPayload,
    status.controllers.patch,
  ]);

// NAMES
router.route('/structures/:rid/names')
  .get(names.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    names.controllers.create,
  ]);

router.route('/structures/:rid/names/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    names.controllers.delete,
  ])
  .get(names.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    names.controllers.patch,
  ]);

// IDENTIFIERS
router.route('/structures/:rid/identifiers')
  .get(identifiers.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    identifiers.controllers.create,
  ]);

router.route('/structures/:rid/identifiers/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    identifiers.controllers.delete,
  ])
  .get(identifiers.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    identifiers.controllers.patch,
  ]);

// LOCALISATIONS
router.route('/structures/:rid/localisations')
  .get(localisations.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
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
    localisations.controllers.patch,
  ]);

// WEBLINKS
router.route('/structures/:rid/weblinks')
  .get(weblinks.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    weblinks.controllers.create,
  ]);

router.route('/structures/:rid/weblinks/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    weblinks.controllers.delete,
  ])
  .get(weblinks.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    weblinks.controllers.patch,
  ]);

// SOCIALMEDIAS
router.route('/structures/:rid/social-medias')
  .get(socialmedias.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    socialmedias.controllers.create,
  ]);

router.route('/structures/:rid/social-medias/:id')
  .delete([
    requireActiveUser,
    patchCtx,
    socialmedias.controllers.delete,
  ])
  .get(socialmedias.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    socialmedias.controllers.patch,
  ]);

export default router;
