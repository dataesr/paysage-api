import express from 'express';

import root from './root/root.routes';
import weblinks from './weblinks/weblinks.routes';
import localisations from './localisations/localisations.routes';

const router = new express.Router();

router.use(root);
router.use(weblinks);
router.use(localisations);

export default router;
