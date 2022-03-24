import express from 'express';
import { serveAsset } from '../commons/middlewares/assets.middlewares';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';

const router = new express.Router();

router.get('/assets/*', [requireActiveUser, serveAsset]);

export default router;
