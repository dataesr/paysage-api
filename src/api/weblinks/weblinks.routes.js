import express from 'express';
import controllers from '../commons/middlewares/crud.middlewares';
import { weblinksRepository as repository } from '../commons/repositories';
import { weblinks as resource } from '../resources';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository));

export default router;
