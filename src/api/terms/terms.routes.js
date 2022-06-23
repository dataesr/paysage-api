import express from 'express';

import terms from './root/root.routes';
import weblinks from './weblinks/weblinks.routes';
import socialmedias from './social-medias/social-medias.routes';

const router = new express.Router();

router.use(terms);
router.use(weblinks);
router.use(socialmedias);

export default router;
