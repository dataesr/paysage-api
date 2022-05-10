import express from 'express';
import { patchCtx } from '../../commons/middlewares/context.middlewares';
import { requireActiveUser } from '../../commons/middlewares/rbac.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import status from './status.resource';
import { validateStatusPayload } from './status.middlewares';

const router = new express.Router();

router.route('/structures/:id/status')
  .put([
    requireActiveUser,
    patchCtx,
    validateStatusPayload,
    status.controllers.patch,
    saveInStore('structures'),
  ]);

export default router;
