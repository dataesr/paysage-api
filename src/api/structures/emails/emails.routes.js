import express from 'express';

import { db } from '../../../services/mongo.service';

import BaseMongoRepository from '../../commons/repositories/base.mongo.repository';
import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { readQuery } from './emails.queries';
import config from '../structures.config';

const { collection } = config;
const field = 'emails';
const repository = new BaseMongoRepository({ db, collection: 'emails' });
const router = new express.Router();

router.route(`/${collection}/:resourceId/${field}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext(field),
    controllers.create(repository, readQuery),
    saveInStore(field),
  ]);

router.route(`/${collection}/:resourceId/${field}/:id`)
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore(field),
  ])
  .delete([
    patchContext,
    controllers.remove(repository),
    saveInStore(field),
  ]);

export default router;
