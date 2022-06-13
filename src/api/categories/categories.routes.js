import express from 'express';

import categories from './root/root.routes';
import identifiers from './identifiers/identifiers.routes';
import weblinks from './weblinks/weblinks.routes';
import socialmedias from './social-medias/social-medias.routes';

const router = new express.Router();

router.use(categories);
router.use(identifiers);
router.use(weblinks);
router.use(socialmedias);

export default router;
