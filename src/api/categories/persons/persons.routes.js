import express from 'express';
import config from '../categories.config';
import controllers from '../../commons/middlewares/crud.middlewares';
import { readQuery } from './persons.queries';
import repository from '../../commons/repositories/relationships.repository';

const { collection } = config;

const router = new express.Router();

router.route(`/${collection}/:resourceId/persons`)
  .get(controllers.list(repository, readQuery));

// router.route(`/${collection}/:resourceId/categories/:id`)
//   .get(controllers.read(repository, readQuery));

export default router;
