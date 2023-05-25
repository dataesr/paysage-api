import express from 'express';

import { geographicalCategories as resource } from '../../resources';
import { geographicalCategoriesRepository as repository } from '../../commons/repositories';
import controllers from '../../commons/middlewares/crud.middlewares';
import readQuery from '../../commons/queries/geographical-categories.query';
import { validatePayload } from './root.middlewares';
import { createContext, patchContext, setGeneratedObjectIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository, readQuery))
  .post([validatePayload, createContext,
    setGeneratedObjectIdInContext(resource),
    controllers.create(repository, readQuery),
    saveInStore,
  ]);

router.route(`/${resource}/:id`)
  .get(controllers.read(repository, readQuery))
  .patch([patchContext, validatePayload,
    controllers.patch(repository, readQuery),
    saveInStore,
  ])
  .delete();

router.route(`/${resource}/:id/structures`)
  .get();

export default router;
