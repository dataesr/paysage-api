import express from 'express';

import { deleteAlternative, setAlternative } from '../../commons/middlewares/alternative-ids.middlewares';
import { createContext, patchContext, setGeneratedObjectIdInContext, setPutIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { deleteFromElastic, saveInElastic, saveInStore } from '../../commons/middlewares/event.middlewares';
import { requireRoles } from '../../commons/middlewares/rbac.middlewares';
import { validatePayload } from '../../commons/middlewares/validate.middlewares';
import elasticQuery from '../../commons/queries/persons.elastic';
import readQuery from '../../commons/queries/persons.query';
import { personsRepository as repository } from '../../commons/repositories';
import { persons as resource } from '../../resources';
import { deletePerson } from './root.middlewares';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    validatePayload,
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
    requireRoles(['admin']),
    patchContext,
    deletePerson,
    saveInStore(resource),
    deleteFromElastic(),
  ])
  .put([
    createContext,
    setPutIdInContext(resource),
    controllers.create(repository, readQuery),
    saveInElastic(repository, elasticQuery, resource),
  ]);

router.route(`/${resource}/:id/alternative-ids/:alternative`)
  .put([
    requireRoles(['admin']),
    patchContext,
    setAlternative(repository, readQuery),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ])
  .delete([
    requireRoles(['admin']),
    patchContext,
    deleteAlternative(repository),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ]);

export default router;
