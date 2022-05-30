import express from 'express';

import getIdentifiersRoutes from '../commons/identifiers/identifiers.routes';
import getSocialMediasRoutes from '../commons/social-medias/social-medias.routes';
import root from './root/root.routes';
import weblinks from './weblinks/weblinks.routes';
import config from './persons.config';

const router = new express.Router();

const { collection } = config;
const identifiers = getIdentifiersRoutes(collection, 'identifiers');
router.use(identifiers);
const socialmedias = getSocialMediasRoutes(collection, 'social-medias');
router.use(socialmedias);

router.use(root);
router.use(weblinks);

export default router;
