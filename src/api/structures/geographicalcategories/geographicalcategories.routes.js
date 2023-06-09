import express from 'express';

import { listExceptionGeographicalCategories, listGeographicalCategories } from './geographicalcategories.middlewares';
import { structures as resource, geographicalCategories as subresource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}/:id/${subresource}`)
  .get(listGeographicalCategories);

router.route(`/${resource}/:id/geographical-exceptions`)
  .get(listExceptionGeographicalCategories);

export default router;
