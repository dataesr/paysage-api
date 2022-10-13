import express from 'express';

import prices from './root/root.routes';
import identifiers from './identifiers/identifiers.routes';
import weblinks from './weblinks/weblinks.routes';

const router = new express.Router();

router.use(prices);
router.use(identifiers);
router.use(weblinks);

export default router;
