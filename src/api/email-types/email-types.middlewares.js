import { BadRequestError } from '../commons/http-errors';
import { emailsRepository } from '../commons/repositories';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  return next();
}

export async function canDelete(req, res, next) {
  const { id } = req.params;
  const { totalCount: referenceCount } = await emailsRepository.find({ emailTypeId: id });
  if (referenceCount) {
    throw new BadRequestError(
      'Cannot delete a referenced object',
      [{
        path: '.params.id',
        message: `Email type '${id}' is still referenced in ${referenceCount} emails`,
      }],
    );
  }
  return next();
}
