import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { saveInElastic, saveInStore } from '../../commons/middlewares/event.middlewares';
import { readQuery, readQueryWithLookup } from '../../commons/queries/identifiers.query';
import elasticQuery from '../../commons/queries/terms.elastic';
import { identifiersRepository as repository, termsRepository } from '../../commons/repositories';
import { identifiers as subresource, terms as resource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}/:resourceId/${subresource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext(subresource),
    controllers.create(repository, readQueryWithLookup),
    saveInStore(subresource),
    saveInElastic(termsRepository, elasticQuery, resource),
  ]);

router.route(`/${resource}/:resourceId/${subresource}/:id`)
  .get(controllers.read(repository, readQueryWithLookup))
  .patch([
    patchContext,
    controllers.patch(repository, readQueryWithLookup),
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
