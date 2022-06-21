import express from 'express';
import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { validatePayload, setPersonIdFromRequestPath } from './categories.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import readQuery from '../../commons/queries/object-categories.query';
import { relationshipsRepository as repository } from '../../commons/repositories';
import { persons as resource, categories as subresource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}/:resourceId/${subresource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    validatePayload,
    createContext,
    setPersonIdFromRequestPath,
    setGeneratedInternalIdInContext('relationships'),
    controllers.create(repository, readQuery),
    saveInStore('relationships'),
  ]);

router.route(`/${resource}/:resourceId/${subresource}/:id`)
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore('relationships'),
  ])
  .get(controllers.read(repository, readQuery))
  .patch([
    validatePayload,
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore('relationships'),
  ]);

export default router;
