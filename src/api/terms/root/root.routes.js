import express from 'express';

import { patchContext, createContext, setGeneratedObjectIdInContext, setPutIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { saveInElastic, saveInStore } from '../../commons/middlewares/event.middlewares';
import elasticQuery from '../../commons/queries/terms.elastic';
import readQuery from '../../commons/queries/terms.query';
import { termsRepository as repository } from '../../commons/repositories';
import { terms as resource } from '../../resources';
import { canIDelete, createTermsResponse, fromPayloadToTerms, setDefaultPriorityField, storeTerms, validatePayload } from './root.middlewares';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    validatePayload,
    setDefaultPriorityField,
    setGeneratedObjectIdInContext(resource),
    fromPayloadToTerms,
    storeTerms,
    createTermsResponse,
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
  ])
  .put([
    createContext,
    setPutIdInContext(resource),
    controllers.create(repository, readQuery),
    saveInElastic(repository, elasticQuery, resource),
  ]);

export default router;
