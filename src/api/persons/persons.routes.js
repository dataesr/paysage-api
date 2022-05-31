import express from 'express';

import identifiers from './identifiers/identifiers.routes';
import root from './root/root.routes';
import socialmedias from './socialmedias/socialmedias.routes';
import categories from './categories/categories.routes';
import weblinks from './weblinks/weblinks.routes';

const router = new express.Router();

router.use(identifiers);
router.use(root);
router.use(socialmedias);
router.use(weblinks);
router.use(categories);

export default router;
