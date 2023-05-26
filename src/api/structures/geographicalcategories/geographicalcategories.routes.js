import express from 'express';

import { listGeographicalCategories } from './geographicalcategories.middlewares';
import { structures as resource, geographicalCategories as subresource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}/:id/${subresource}`)
  .get([
    listGeographicalCategories,
  ]);

export default router;
