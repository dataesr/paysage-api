import { BadRequestError } from '../commons/http-errors';
import { documentsRepository } from '../commons/repositories';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  return next();
}

export async function canDelete(req, res, next) {
  const { id } = req.params;
  const { totalCo: referenceCount } = await documentsRepository.find({ documentTypeId: id });
  if (referenceCount) {
    throw new BadRequestError(
      'Cannot delete a referenced object',
      [{
        path: '.params.id',
        message: `Document type '${id}' is still referenced in ${referenceCount} documents`,
      }],
    );
  }
  return next();
}
