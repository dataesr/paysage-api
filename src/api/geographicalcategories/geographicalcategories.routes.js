import express from 'express';

import geographicalcategories from './root/root.routes';
import exceptions from './exceptions/exceptions.routes';

const router = new express.Router();

router.use(geographicalcategories);
router.use(exceptions);

export default router;
