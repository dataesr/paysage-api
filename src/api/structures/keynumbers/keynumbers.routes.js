import express from 'express';

import { structures as resource, keynumbers as subresource } from '../../resources';
import { find as findAll, setFilters } from './keynumbers.middleware';

const router = new express.Router();

router.route(`/${resource}/:resourceId/${subresource}/:dataset`)
  .get(setFilters, findAll);

export default router;
