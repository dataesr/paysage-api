import express from 'express';

import controllers from '../../commons/middlewares/crud.middlewares';
import { keynumbersRepository as repository } from '../../commons/repositories';
import { structures as resource, keynumbers as subresource } from '../../resources';
import { setFilters } from './keynumbers.middleware';

const router = new express.Router();

router.route(`/${resource}/:resourceId/${subresource}/:dataset`)
  .get(setFilters, controllers.list(repository));

export default router;
