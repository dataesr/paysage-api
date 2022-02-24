import express from 'express';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { patchCtx, createCtx } from '../commons/middlewares/context.middleware';
import categories from './root/root.resource';
import identifiers from './identifiers/identifiers.resource';
import weblinks from './weblinks/weblinks.resource';
import { validatePayload, setPutIdInContext } from './root/root.middlewares';

const router = new express.Router();

// CATEGORIES
router.route('/categories')
  .get(categories.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    validatePayload,
    categories.controllers.create,
  ]);

router.route('/categories/:id')
  .get(categories.controllers.read)
  .patch([
    requireActiveUser,
    patchCtx,
    validatePayload,
    categories.controllers.patch,
  ])
  .delete([
    requireActiveUser,
    patchCtx,
    categories.controllers.delete,
  ])
  .put([
    requireActiveUser,
    createCtx,
    setPutIdInContext,
    categories.controllers.create,
  ]);

// IDENTIFIERS
router.route('/categories/:rid/identifiers')
  .get(identifiers.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    identifiers.controllers.create,
  ]);

router.route('/categories/:rid/identifiers/:id')
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

// WEBLINKS
router.route('/categories/:rid/weblinks')
  .get(weblinks.controllers.list)
  .post([
    requireActiveUser,
    createCtx,
    weblinks.controllers.create,
  ]);

router.route('/categories/:rid/weblinks/:id')
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

export default router;
