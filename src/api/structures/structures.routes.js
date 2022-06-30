import express from 'express';

import categories from './categories/categories.routes';
import emails from './emails/emails.routes';
import identifiers from './identifiers/identifiers.routes';
import legalcategories from './legalcategories/legalcategories.routes';
import localisations from './localisations/localisations.routes';
import logos from './logos/logos.routes';
import names from './names/names.routes';
import socialmedias from './social-medias/social-medias.routes';
import structures from './root/root.routes';
import supervisingministers from './supervising-ministers/supervising-ministers.routes';
import weblinks from './weblinks/weblinks.routes';

const router = new express.Router();

router.use(categories);
router.use(emails);
router.use(identifiers);
router.use(legalcategories);
router.use(localisations);
router.use(logos);
router.use(names);
router.use(socialmedias);
router.use(structures);
router.use(supervisingministers);
router.use(weblinks);

export default router;
