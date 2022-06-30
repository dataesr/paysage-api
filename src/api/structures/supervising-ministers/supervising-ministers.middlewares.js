import { BadRequestError } from '../../commons/http-errors';
import { supervisingMinistersRepository } from '../../commons/repositories';

export function setStructureIdFromRequestPath(req, res, next) {
  const { resourceId } = req.params;
  req.context.structureId = resourceId;
  return next();
}

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const { supervisingMinisterId } = req.body;
  if (!supervisingMinisterId) return next();
  const exists = await supervisingMinistersRepository.get(supervisingMinisterId);
  if (!exists) {
    throw new BadRequestError(
      'Referencing unknown resource',
      [{
        path: '.body.supervisingMinisterId',
        message: `supervising minister '${supervisingMinisterId}' does not exist`,
      }],
    );
  }
  return next();
}
