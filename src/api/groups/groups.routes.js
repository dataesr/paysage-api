import express from 'express';

import groups from './root/groups.routes';
import members from './members/members.routes';

const router = new express.Router();

router.use(groups);
router.use(members);

export default router;
