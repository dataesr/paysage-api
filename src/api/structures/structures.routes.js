import express from 'express';

import getIdentifiersRoutes from '../commons/identifiers/identifiers.routes';
import getSocialMediasRoutes from '../commons/social-medias/social-medias.routes';
import categories from './categories/categories.routes';
import localisations from './localisations/localisations.routes';
import logos from './logos/logos.routes';
import names from './names/names.routes';
import structures from './root/root.routes';
import weblinks from './weblinks/weblinks.routes';
import config from './structures.config';

const router = new express.Router();

const { collection } = config;
const identifiers = getIdentifiersRoutes(collection, 'identifiers');
router.use(identifiers);
const socialmedias = getSocialMediasRoutes(collection, 'social-medias');
router.use(socialmedias);

router.use(categories);
router.use(localisations);
router.use(logos);
router.use(names);
router.use(structures);
router.use(weblinks);

export default router;
