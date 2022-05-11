import { BadRequestError } from '../../../libs/http-errors';

export function validatePayload(req, res, next) {
  if (
    !req.body
    || !Object.keys(req.body).length
  ) throw new BadRequestError('Payload missing');
  return next();
}
