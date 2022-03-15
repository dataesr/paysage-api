import express from 'express';
import { patchCtx } from '../../commons/middlewares/context.middleware';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import status from './status.resource';
import { validateStatusPayload } from './status.middlewares';

const router = new express.Router();

router.route('/structures/:id/status')
  .put([
    requireActiveUser,
    patchCtx,
    validateStatusPayload,
    status.controllers.patch,
  ]);

export default router;
