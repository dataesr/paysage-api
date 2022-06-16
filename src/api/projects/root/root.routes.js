import express from 'express';

import { patchContext, createContext, setGeneratedObjectIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { validatePayload } from '../../commons/middlewares/validate.middlewares';
import { readQuery } from './root.queries';
import projectsRepository from './root.repository';

const collection = 'projects';

const router = new express.Router();

router.route(`/${collection}`)
  .get(controllers.list(projectsRepository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedObjectIdInContext(collection),
    controllers.create(projectsRepository, readQuery),
    saveInStore(collection),
  ]);

router.route(`/${collection}/:id`)
  .get(controllers.read(projectsRepository, readQuery))
  .patch([
    patchContext,
    validatePayload,
    controllers.patch(projectsRepository, readQuery),
    saveInStore(collection),
  ])
  .delete([
    patchContext,
    controllers.remove(projectsRepository),
    saveInStore(collection),
  ]);

export default router;
