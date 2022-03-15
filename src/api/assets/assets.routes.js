import express from 'express';
import { serveAsset } from '../commons/middlewares/assets.middlewares';
import { requireActiveUser, requireRoles } from '../commons/middlewares/rbac.middlewares';

const router = new express.Router();

router.get('/assets/public', [requireActiveUser, serveAsset]);
router.get('/assets/private', [
  requireActiveUser,
  requireRoles(['admin', 'contributor+']),
  serveAsset,
]);
export default router;
