import { BadRequestError } from '../http-errors';
import { validateFilters, validateSort } from '../helpers/query-params';

export function validatePayload(req, res, next) {
  if (
    !req.body
    || !Object.keys(req.body).length
  ) throw new BadRequestError('Payload missing');
  return next();
}

export function validateQuery(req, res, next) {
  validateFilters(req.query.filters);
  validateSort(req.query.sort);
  return next();
}
