import { BadRequestError } from '../../commons/http-errors';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  return next();
}
