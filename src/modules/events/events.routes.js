import express from 'express';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import changelogsControllers from './events.controllers';

const router = new express.Router();
// router.use(requireActiveUser);

router.get('/events', changelogsControllers.list);

export default router;
