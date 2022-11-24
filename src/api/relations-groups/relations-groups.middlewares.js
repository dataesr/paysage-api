import { BadRequestError } from '../commons/http-errors';
import { catalogRepository } from '../commons/repositories';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const { resourceId } = req.body;
  if (resourceId) {
    const exists = await catalogRepository._collection.findOne({ _id: resourceId });
    if (exists) return next();
  }
  throw new BadRequestError(
    'Referencing unknown resource id',
    [{
      path: '.param.resourceId',
      message: `'${resourceId}' does not exist`,
    }],
  );
}
