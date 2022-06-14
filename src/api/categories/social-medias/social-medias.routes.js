import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { validatePayload } from './social-medias.middlewares';
import { readQuery } from '../../commons/social-medias/social-medias.queries';
import repository from '../../commons/social-medias/social-medias.repository';
import config from '../categories.config';

const { collection } = config;
const field = 'social-medias';
const router = new express.Router();

router.route(`/${collection}/:resourceId/${field}`)
  .get(controllers.list(repository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedInternalIdInContext(field),
    controllers.create(repository, readQuery),
    saveInStore(field),
  ]);

router.route(`/${collection}/:resourceId/${field}/:id`)
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore(field),
  ])
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(field),
  ]);

export default router;
