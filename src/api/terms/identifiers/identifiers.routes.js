import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInElastic, saveInStore } from '../../commons/middlewares/event.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { identifiersRepository as repository, termsRepository } from '../../commons/repositories';
import readQuery from '../../commons/queries/identifiers.query';
import elasticQuery from '../../commons/queries/terms.elastic';
import {
  terms as resource,
  identifiers as subresource,
} from '../../resources';

const router = new express.Router();

router.route(`/${resource}/:resourceId/${subresource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext(subresource),
    controllers.create(repository, readQuery),
    saveInStore(subresource),
    saveInElastic(termsRepository, elasticQuery, resource),
  ]);

router.route(`/${resource}/:resourceId/${subresource}/:id`)
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore(subresource),
    saveInElastic(termsRepository, elasticQuery, resource),
  ])
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(subresource),
    saveInElastic(termsRepository, elasticQuery, resource),
  ]);

export default router;
