import express from 'express';

import categories from './categories/categories.routes';
import identifiers from './identifiers/identifiers.routes';
import localisations from './localisations/localisations.routes';
import logos from './logos/logos.routes';
import names from './names/names.routes';
import socialmedias from './socialmedias/socialmedias.routes';
import structures from './root/root.routes';
import weblinks from './weblinks/weblinks.routes';

const router = new express.Router();

router.use(categories);
router.use(identifiers);
router.use(localisations);
router.use(logos);
router.use(names);
router.use(socialmedias);
router.use(structures);
router.use(weblinks);

export default router;
