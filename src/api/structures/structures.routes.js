import express from 'express';
import structures from './root/root.routes';
import status from './status/status.routes';
import names from './names/names.routes';
import logos from './logos/logos.routes';
import identifiers from './identifiers/identifiers.routes';
import localisations from './localisations/localisations.routes';
import weblinks from './weblinks/weblinks.routes';
import socialmedias from './socialmedias/socialmedias.routes';

const router = new express.Router();

router.use(structures);
router.use(status);
router.use(names);
router.use(identifiers);
router.use(localisations);
router.use(socialmedias);
router.use(weblinks);
router.use(logos);

export default router;
