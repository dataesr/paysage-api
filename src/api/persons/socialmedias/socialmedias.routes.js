import express from 'express';
import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middleware';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import repository from './socialmedias.repository';
import config from '../persons.config';
import controllers from '../../commons/middlewares/crud-nested.middlewares';
import { readQuery } from './socialmedias.queries';

const router = new express.Router();
const collectionField = `${config.collectionName}-${config.socialMediasField}`;

router.route('/persons/:resourceId/socials')
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext(collectionField),
    controllers.create(repository, readQuery),
    saveInStore(collectionField),
  ]);

router.route('/persons/:resourceId/socials/:id')
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(collectionField),
  ])
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore(collectionField),
  ]);

export default router;
