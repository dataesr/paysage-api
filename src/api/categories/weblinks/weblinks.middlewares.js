import { BadRequestError, NotFoundError } from '../../commons/http-errors';
import repository from '../root/root.repository';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  if (req.params.resourceId) {
    const exists = await repository.get(req.params.resourceId);
    if (!exists) {
      throw new NotFoundError(
        'Referencing unknown resource id',
        [{
          path: '.param.resourceId',
          message: `'${req.params.resourceId}' does not exist`,
        }],
      );
    }
  }
  return next();
}
