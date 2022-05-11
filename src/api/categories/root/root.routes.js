import express from 'express';
import { patchContext, createContext, setGeneratedObjectIdInContext } from '../../commons/middlewares/context.middleware';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { validatePayload } from './root.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';

import { readQuery } from './root.queries';
import categoriesRepository from './root.repository';
import config from '../categories.config';

const router = new express.Router();
router.route('/categories')
  .get(controllers.list(categoriesRepository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedObjectIdInContext(config.collectionName),
    controllers.create(categoriesRepository, readQuery),
    saveInStore('categories'),
  ]);

router.route('/categories/:id')
  .get(controllers.read(categoriesRepository, readQuery))
  .patch([
    patchContext,
    validatePayload,
    controllers.patch(categoriesRepository, readQuery),
    saveInStore('categories'),
  ])
  .delete([
    patchContext,
    controllers.remove(categoriesRepository),
    saveInStore('categories'),
  ]);

export default router;
