import express from 'express';

import usersGroup from './root/usersgroups.routes';
// import members from './members/members.routes';

const router = new express.Router();

router.use(usersGroup);

export default router;
