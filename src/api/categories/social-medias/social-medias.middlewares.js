import { BadRequestError } from '../../commons/http-errors';
import categoriesRepository from '../root/root.repository';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const { resourceId } = req.param;
  if (resourceId) {
    const exists = await categoriesRepository.get(resourceId);
    if (!exists) {
      throw new BadRequestError(
        'Referencing unknown resource id',
        [{
          path: '.param.resourceId',
          message: `Category '${resourceId}' does not exist`,
        }],
      );
    }
  }
  return next();
}
