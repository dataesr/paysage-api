import express from 'express';

import { patchContext, createContext, setGeneratedObjectIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { saveInElastic, saveInStore } from '../../commons/middlewares/event.middlewares';
import elasticQuery from '../../commons/queries/categories.elastic';
import readQuery from '../../commons/queries/categories.query';
import { categoriesRepository as repository } from '../../commons/repositories';
import { categories as resource } from '../../resources';
import { canIDelete, setDefaultPriorityField, validatePayload } from './root.middlewares';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    validatePayload,
    setDefaultPriorityField,
    createContext,
    setGeneratedObjectIdInContext(resource),
    controllers.create(repository, readQuery),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ]);

router.route(`/${resource}/:id`)
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    validatePayload,
    controllers.patch(repository, readQuery),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ])
  .delete([
    patchContext,
    canIDelete,
    controllers.softDelete(repository),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ]);

export default router;
