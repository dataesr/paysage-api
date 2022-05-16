import express from 'express';
import { patchContext, createContext, setGeneratedObjectIdInContext } from '../commons/middlewares/context.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import { validatePayload } from './legalcategories.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';

import { readQuery } from './legalcategories.queries';
import legalCategoriesRepository from './legalcategories.repository';
import config from './legalcategories.config';

const { collection } = config;

const router = new express.Router();

router.route('/legalcategories')
  .get(controllers.list(legalCategoriesRepository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedObjectIdInContext(collection),
    controllers.create(legalCategoriesRepository, readQuery),
    saveInStore(collection),
  ]);

router.route('/legalcategories/:id')
  .get(controllers.read(legalCategoriesRepository, readQuery))
  .patch([
    patchContext,
    validatePayload,
    controllers.patch(legalCategoriesRepository, readQuery),
    saveInStore(collection),
  ])
  .delete([
    patchContext,
    controllers.remove(legalCategoriesRepository),
    saveInStore(collection),
  ]);

export default router;
