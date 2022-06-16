import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { readQuery } from '../../commons/weblinks/weblinks.queries';
import { validatePayload } from './weblinks.middlewares';
import weblinksRepository from '../../commons/weblinks/weblinks.respository';

const collection = 'projects';
const field = 'weblinks';

const router = new express.Router();

router.route(`/${collection}/:resourceId/${field}`)
  .get(controllers.list(weblinksRepository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedInternalIdInContext(field),
    controllers.create(weblinksRepository, readQuery),
    saveInStore(field),
  ]);

router.route(`/${collection}/:resourceId/${field}/:id`)
  .delete([
    patchContext,
    controllers.remove(weblinksRepository),
    saveInStore(field),
  ])
  .get(controllers.read(weblinksRepository, readQuery))
  .patch([
    validatePayload,
    patchContext,
    controllers.patch(weblinksRepository, readQuery),
    saveInStore(field),
  ]);

export default router;
