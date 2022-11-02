import express from 'express';

import root from './root/root.routes';
import weblinks from './weblinks/weblinks.routes';
import localisations from './localisations/localisations.routes';
import identifiers from './identifiers/identifiers.routes';
import socialmedias from './social-medias/social-medias.routes';

const router = new express.Router();

router.use(root);
router.use(weblinks);
router.use(localisations);
router.use(identifiers);
router.use(socialmedias);

export default router;
