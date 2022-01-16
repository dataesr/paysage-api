import express from 'express';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import changelogsControllers from './changelogs.controllers';

const router = new express.Router();
router.use(requireActiveUser);

router.get('/structures', changelogsControllers.list);

export default router;
