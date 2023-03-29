import express from 'express';
import agenda from '../../jobs';
import { BadRequestError } from '../commons/http-errors';
import { requireRoles } from '../commons/middlewares/rbac.middlewares';
import { jobsRepository } from '../commons/repositories';
import readQuery from '../commons/queries/jobs.query';
import controllers from '../commons/middlewares/crud.middlewares';

const router = new express.Router();
const ALLOWED_TYPES = ['categories', 'legal-categories', 'official-texts', 'persons', 'prizes', 'projects', 'structures', 'terms', 'users'];

async function reindex(req, res) {
  const { types } = req.body;
  if (!types) throw new BadRequestError('No object type submitted');
  if (!types.every((type) => ALLOWED_TYPES.includes(type))) throw new BadRequestError('An object type is not allowed.');
  const job = agenda.now(reindex, { types });
  res.status(202).json(job);
}

router.route('/jobs/reindex')
  .post(requireRoles(['admin']), reindex)
  .get(requireRoles(['admin']), controllers.list(jobsRepository, readQuery));

export default router;
