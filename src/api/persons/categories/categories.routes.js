import express from 'express';
import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { validatePayload, setPersonIdFromRequestPath } from './categories.middlewares';
import config from '../persons.config';
import controllers from '../../commons/middlewares/crud.middlewares';
import { readQuery } from './categories.queries';
import repository from '../../commons/repositories/relationships.repository';

const { collection } = config;

const router = new express.Router();

router.route(`/${collection}/:resourceId/categories`)
  .get(controllers.list(repository, readQuery))
  .post([
    validatePayload,
    createContext,
    setPersonIdFromRequestPath,
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
