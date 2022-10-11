import express from 'express';

import emails from './emails/emails.routes';
import identifiers from './identifiers/identifiers.routes';
import keynumbers from './keynumbers/keynumbers.routes';
import localisations from './localisations/localisations.routes';
import logos from './logos/logos.routes';
import names from './names/names.routes';
import relationsgroups from './relations-groups/relations-groups.routes';
import socialmedias from './social-medias/social-medias.routes';
import structures from './root/root.routes';
import weblinks from './weblinks/weblinks.routes';

const router = new express.Router();

router.use(emails);
router.use(identifiers);
router.use(keynumbers);
router.use(localisations);
router.use(logos);
router.use(names);
router.use(relationsgroups);
router.use(socialmedias);
router.use(structures);
router.use(weblinks);

export default router;
