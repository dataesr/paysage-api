import { BadRequestError } from '../../commons/http-errors';
import { emailTypesRepository } from '../../commons/repositories';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const errors = [];
  const { emailTypesId } = req.body;
  if (emailTypesId) {
    const emailType = await emailTypesRepository._collection.findOne({ id: emailTypesId });
    if (!emailType) { errors.push({ path: '.body.emailTypesId', message: `emailType ${emailTypesId} does not exist` }); }
  }
  if (errors.length) throw new BadRequestError('Validation failed', errors);
  return next();
}
