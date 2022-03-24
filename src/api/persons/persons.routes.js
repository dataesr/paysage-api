import express from 'express';
import root from './root/root.routes';
import identifiers from './identifiers/identifiers.routes';
import weblinks from './weblinks/weblinks.routes';
import socialmedias from './socialmedias/socialmedias.routes';

const router = new express.Router();

router.use(root);
router.use(identifiers);
router.use(socialmedias);
router.use(weblinks);

export default router;
