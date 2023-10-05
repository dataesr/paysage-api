import express from 'express';

import { createContext, patchContext, setGeneratedObjectIdInContext, setPutIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { saveInElastic, saveInStore } from '../../commons/middlewares/event.middlewares';
import elasticQuery from '../../commons/queries/prizes.elastic';
import readQuery from '../../commons/queries/prizes.query';
import { prizesRepository as repository } from '../../commons/repositories';
import { prizes as resource } from '../../resources';
import { canIDelete, createPriceResponse, fromPayloadToPrizes, storePrice, validatePayload } from './root.middlewares';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedObjectIdInContext(resource),
    fromPayloadToPrizes,
    storePrice,
    createPriceResponse,
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ]);

router.route(`/${resource}/:id`)
  .get(controllers.read(repository, readQuery))
  .put([
    createContext,
    setPutIdInContext(resource),
    fromPayloadToPrizes,
    controllers.create(repository, readQuery),
    saveInElastic(repository, elasticQuery, resource),
  ])
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
