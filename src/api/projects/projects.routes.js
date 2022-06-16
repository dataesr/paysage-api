import express from 'express';

import root from './root/root.routes';
import weblinks from './weblinks/weblinks.routes';

const router = new express.Router();

router.use(root);
router.use(weblinks);

export default router;
