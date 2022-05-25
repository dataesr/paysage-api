import express from 'express';

import getIdentifiersRoutes from '../commons/identifiers/identifiers.routes';
import root from './root/root.routes';
import socialmedias from './socialmedias/socialmedias.routes';
import weblinks from './weblinks/weblinks.routes';
import config from './persons.config';

const router = new express.Router();

const { collection } = config;
const identifiers = getIdentifiersRoutes(collection);
router.use(identifiers);

router.use(root);
router.use(socialmedias);
router.use(weblinks);

export default router;
