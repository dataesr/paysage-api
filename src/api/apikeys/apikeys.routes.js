import express from 'express';
import { patchContext, createContext, setGeneratedInternalIdInContext } from '../commons/middlewares/context.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import { requireRoles } from '../commons/middlewares/rbac.middlewares';
import { ApiKeyQuery } from '../commons/queries/apikeys.query';
import { setApiKeyInContext, setUserIdInContext } from './apikeys.middlewares';
import { apiKeysRepository as repository } from '../commons/repositories';
import { apikeys as resource } from '../resources';

const router = new express.Router();

router.route(`/admin/${resource}`)
  .get(requireRoles(['admin']), controllers.list(repository, ApiKeyQuery))
  .post([
    requireRoles(['admin']),
    createContext,
    setGeneratedInternalIdInContext(resource),
    setUserIdInContext,
    setApiKeyInContext,
    controllers.create(repository, ApiKeyQuery),
    saveInStore(resource),
  ]);

router.route(`/admin/${resource}/:id`)
  .delete([
    requireRoles(['admin']),
    patchContext,
    controllers.remove(repository),
    saveInStore(resource),
  ]);

export default router;
