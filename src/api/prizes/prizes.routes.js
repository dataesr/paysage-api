import express from 'express';

import prizes from './root/root.routes';
import identifiers from './identifiers/identifiers.routes';
import weblinks from './weblinks/weblinks.routes';

const router = new express.Router();

router.use(prizes);
router.use(identifiers);
router.use(weblinks);

export default router;
