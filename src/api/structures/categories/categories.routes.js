import express from 'express';

import { validatePayload, setStructureIdFromRequestPath } from './categories.middlewares';
import { readQuery } from './categories.queries';
import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import repository from '../../commons/repositories/relationships.repository';
import config from '../structures.config';

const { collection } = config;

const router = new express.Router();

router.route(`/${collection}/:resourceId/categories`)
  .get(controllers.list(repository, readQuery))
  .post([
    validatePayload,
    createContext,
    setStructureIdFromRequestPath,
    setGeneratedInternalIdInContext('relationships'),
    controllers.create(repository, readQuery),
    saveInStore('relationships'),
  ]);

router.route(`/${collection}/:resourceId/categories/:id`)
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore('relationships'),
  ])
  .get(controllers.read(repository, readQuery))
  .patch([
    validatePayload,
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore('relationships'),
  ]);

export default router;
