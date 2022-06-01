import express from 'express';
import { patchContext, createContext, setGeneratedObjectIdInContext } from '../commons/middlewares/context.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import { validatePayload } from '../commons/middlewares/validate.middlewares';

import { readQuery } from './officialtexts.queries';
import officialTextsRepository from './officialtexts.repository';
import config from './officialtexts.config';

const { collection } = config;

const router = new express.Router();

router.route('/official-texts')
  .get(controllers.list(officialTextsRepository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedObjectIdInContext(collection),
    controllers.create(officialTextsRepository, readQuery),
    saveInStore(collection),
  ]);

router.route('/official-texts/:id')
  .get(controllers.read(officialTextsRepository, readQuery))
  .patch([
    validatePayload,
    patchContext,
    controllers.patch(officialTextsRepository, readQuery),
    saveInStore(collection),
  ])
  .delete([
    patchContext,
    controllers.remove(officialTextsRepository),
    saveInStore(collection),
  ]);

export default router;
