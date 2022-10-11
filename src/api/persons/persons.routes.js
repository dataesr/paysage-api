import express from 'express';

import identifiers from './identifiers/identifiers.routes';
import root from './root/root.routes';
import socialmedias from './social-medias/social-medias.routes';
import weblinks from './weblinks/weblinks.routes';
import relationsgroup from './relations-groups/relations-groups.routes';

const router = new express.Router();

router.use(identifiers);
router.use(relationsgroup);
router.use(root);
router.use(socialmedias);
router.use(weblinks);

export default router;
