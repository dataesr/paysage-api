import express from 'express';
import controllers from '../commons/middlewares/crud.middlewares';
import { identifiersRepository as repository } from '../commons/repositories';
import { identifiers as resource } from '../resources';
import { readQuery } from '../commons/queries/identifiers.query';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository, readQuery));

export default router;
