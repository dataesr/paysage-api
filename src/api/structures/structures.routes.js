import express from 'express';

import getIdentifiersRoutes from '../commons/identifiers/identifiers.routes';
import categories from './categories/categories.routes';
import localisations from './localisations/localisations.routes';
import logos from './logos/logos.routes';
import names from './names/names.routes';
import socialmedias from './socialmedias/socialmedias.routes';
import structures from './root/root.routes';
import weblinks from './weblinks/weblinks.routes';
import config from './structures.config';

const router = new express.Router();

const { collection } = config;
const identifiers = getIdentifiersRoutes(collection);
router.use(identifiers);

router.use(categories);
router.use(localisations);
router.use(logos);
router.use(names);
router.use(socialmedias);
router.use(structures);
router.use(weblinks);

export default router;
