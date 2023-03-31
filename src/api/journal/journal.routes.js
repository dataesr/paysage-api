import express from 'express';
import { eventsRepository as repository } from '../commons/repositories';
import controllers from '../commons/middlewares/crud.middlewares';
import readQuery from '../commons/queries/journal.query';
import dashboardQuery from '../commons/queries/dashboard.query';
import { requireRoles } from '../commons/middlewares/rbac.middlewares';

const router = new express.Router();

router.route('/journal')
  .get(requireRoles(['admin']), controllers.list(repository, readQuery));

router.route('/dashboard')
  .get(requireRoles(['admin']), controllers.list(repository, dashboardQuery));

export default router;
