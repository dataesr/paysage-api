import express from 'express';
import { patchContext, createContext, setGeneratedInternalIdInContext } from '../commons/middlewares/context.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import { validatePayload } from './officialtext.middlewares';
import officialTextsRepository from './officialtexts.repository';

import { readQuery } from './officialtexts.queries';

const collection = 'official-texts';

const router = new express.Router();

router.route('/official-texts')
  .get(controllers.list(officialTextsRepository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedInternalIdInContext(collection),
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
