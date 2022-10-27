import express from 'express';
import { eventsRepository as repository } from '../commons/repositories';
import controllers from '../commons/middlewares/crud.middlewares';
import readQuery from '../commons/queries/journal.query';

const router = new express.Router();

router.route('/journal')
  .get(controllers.list(repository, readQuery));

export default router;
