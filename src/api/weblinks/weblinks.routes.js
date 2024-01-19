import express from 'express';
import controllers from '../commons/middlewares/crud.middlewares';
import { weblinksRepository as repository } from '../commons/repositories';
import { weblinks as resource } from '../resources';
import { readQuery } from '../commons/queries/weblinks.query';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository, readQuery));

export default router;
