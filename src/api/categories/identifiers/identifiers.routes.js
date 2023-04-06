import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { saveInElastic, saveInStore } from '../../commons/middlewares/event.middlewares';
import elasticQuery from '../../commons/queries/categories.elastic';
import { readQuery, readQueryWithLookup } from '../../commons/queries/identifiers.query';
import { categoriesRepository, identifiersRepository as repository } from '../../commons/repositories';
import { categories as resource, identifiers as subresource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}/:resourceId/${subresource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext(subresource),
    controllers.create(repository, readQueryWithLookup),
    saveInStore(subresource),
    saveInElastic(categoriesRepository, elasticQuery, resource),
  ]);

router.route(`/${resource}/:resourceId/${subresource}/:id`)
  .get(controllers.read(repository, readQueryWithLookup))
  .patch([
    patchContext,
    controllers.patch(repository, readQueryWithLookup),
    saveInStore(subresource),
    saveInElastic(categoriesRepository, elasticQuery, resource),
  ])
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(subresource),
    saveInElastic(categoriesRepository, elasticQuery, resource),
  ]);

export default router;
