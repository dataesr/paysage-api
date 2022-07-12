import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud-nested.middlewares';
import { saveInElastic, saveInStore } from '../../commons/middlewares/event.middlewares';
import { structureNamesRepository as repository } from '../../commons/repositories';
import readQuery from '../../commons/queries/names.query';
import elasticQuery from '../../commons/queries/names.elastic';
import { structures as resource, names as subresource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}/:resourceId/${subresource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext(subresource),
    controllers.create(repository, readQuery),
    saveInStore(subresource),
    saveInElastic(repository, elasticQuery, resource),
  ]);

router.route(`/${resource}/:resourceId/${subresource}/:id`)
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore(subresource),
  ])
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(subresource),
  ]);

export default router;
