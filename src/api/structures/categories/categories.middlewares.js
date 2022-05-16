import { BadRequestError } from '../../../libs/http-errors';
import categoriesRepository from '../../categories/root/root.repository';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const { categoryId } = req.body;
  if (!categoryId) return next();
  const exists = await categoriesRepository.get(categoryId);
  if (!exists) {
    throw new BadRequestError(
      'Referencing unknown resource',
      [{
        path: '.body.categoryId',
        message: `category '${categoryId}' does not exist`,
      }],
    );
  }
  return next();
}
