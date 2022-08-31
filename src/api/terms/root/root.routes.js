import express from 'express';

import { patchContext, createContext, setGeneratedObjectIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInElastic, saveInStore } from '../../commons/middlewares/event.middlewares';
import { validatePayload, setDefaultPriorityField } from './root.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import readQuery from '../../commons/queries/terms.query';
import elasticQuery from '../../commons/queries/terms.elastic';
import { termsRepository as repository } from '../../commons/repositories';
import { terms as resource } from '../../resources';

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
    controllers.remove(repository),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ]);

export default router;
