import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInElastic, saveInStore } from '../../commons/middlewares/event.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { identifiersRepository as repository, projectsRepository } from '../../commons/repositories';
import readQuery from '../../commons/queries/identifiers.query';
import elasticQuery from '../../commons/queries/projects.elastic';
import { projects as resource, identifiers as subresource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}/:resourceId/${subresource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext(subresource),
    controllers.create(repository, readQuery),
    saveInStore(subresource),
    saveInElastic(projectsRepository, elasticQuery, resource),
  ]);

router.route(`/${resource}/:resourceId/${subresource}/:id`)
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore(subresource),
    saveInElastic(projectsRepository, elasticQuery, resource),
  ])
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(subresource),
    saveInElastic(projectsRepository, elasticQuery, resource),
  ]);

export default router;
