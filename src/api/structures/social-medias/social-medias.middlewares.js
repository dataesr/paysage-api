import { BadRequestError } from '../../commons/http-errors';
import { structuresRepository } from '../../commons/repositories';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const { resourceId } = req.params;
  if (resourceId) {
    const exists = await structuresRepository._collection.findOne({ id: resourceId });
    if (!exists) {
      throw new BadRequestError(
        'Referencing unknown resource id',
        [{
          path: '.param.resourceId',
          message: `Structure '${resourceId}' does not exist`,
        }],
      );
    }
  }
  return next();
}
