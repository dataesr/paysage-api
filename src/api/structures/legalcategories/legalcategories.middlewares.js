import { BadRequestError } from '../../commons/http-errors';
import { legalcategoriesRepository } from '../../commons/repositories';

export function setStructureIdFromRequestPath(req, res, next) {
  const { resourceId } = req.params;
  req.context.structureId = resourceId;
  return next();
}

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const { legalcategoryId } = req.body;
  if (!legalcategoryId) return next();
  const exists = await legalcategoriesRepository.get(legalcategoryId);
  if (!exists) {
    throw new BadRequestError(
      'Referencing unknown resource',
      [{
        path: '.body.legalcategoryId',
        message: `legal category '${legalcategoryId}' does not exist`,
      }],
    );
  }
  return next();
}
