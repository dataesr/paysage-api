import express from 'express';

import { patchContext, createContext, setGeneratedInternalIdInContext, setPutIdInContext } from '../commons/middlewares/context.middlewares';
import { saveInElastic, saveInStore } from '../commons/middlewares/event.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import { validatePayload } from './officialtext.middlewares';
import elasticQuery from '../commons/queries/officialtexts.elastic';
import readQuery from '../commons/queries/officialtexts.query';
import { officialtextsRepository as repository } from '../commons/repositories';
import { officialtexts as resource } from '../resources';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedInternalIdInContext(resource),
    controllers.create(repository, readQuery),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ]);

router.route(`/${resource}/:id`)
  .get(controllers.read(repository, readQuery))
  .put([
    createContext,
    setPutIdInContext(resource),
    controllers.create(repository, readQuery),
    saveInElastic(repository, elasticQuery, resource),
  ])
  .patch([
    validatePayload,
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ])
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ])
  .put([
    createContext,
    setPutIdInContext(resource),
    controllers.create(repository, readQuery),
    saveInElastic(repository, elasticQuery, resource),
  ]);

export default router;
