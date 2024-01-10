import express from 'express';
import controllers from '../commons/middlewares/crud.middlewares';
import { identifiersRepository as repository } from '../commons/repositories';
import { identifiers as resource } from '../resources';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository));

export default router;
