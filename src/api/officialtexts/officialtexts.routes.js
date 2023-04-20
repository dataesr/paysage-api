import express from 'express';

import { deleteAlternative, setAlternative } from '../commons/middlewares/alternative-ids.middlewares';
import { createContext, patchContext, setGeneratedInternalIdInContext, setPutIdInContext } from '../commons/middlewares/context.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import { deleteFromElastic, saveInElastic, saveInStore } from '../commons/middlewares/event.middlewares';
import { requireRoles } from '../commons/middlewares/rbac.middlewares';
import elasticQuery from '../commons/queries/official-texts.elastic';
import readQuery from '../commons/queries/official-texts.query';
import { officialtextsRepository as repository } from '../commons/repositories';
import { officialtexts as resource } from '../resources';
import { deleteOfficialText, validatePayload } from './officialtext.middlewares';

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
    requireRoles(['admin']),
    patchContext,
    deleteOfficialText,
    saveInStore(resource),
    deleteFromElastic(),
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
