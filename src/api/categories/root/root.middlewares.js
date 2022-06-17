import { BadRequestError } from '../../commons/http-errors';
import { categoriesRepository, officialtextsRepository } from '../../commons/repositories';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const { officialTextId, parentIds } = req.body;
  if (officialTextId) {
    const exists = await officialtextsRepository.get(officialTextId);
    if (!exists) {
      throw new BadRequestError(
        'Referencing unknown resource',
        [{
          path: '.body.officialTextId',
          message: `official text '${officialTextId}' does not exist`,
        }],
      );
    }
  }
  if (parentIds) {
    const { data } = await categoriesRepository.find({ filters: { id: { $in: parentIds } } });
    const savedParents = data.reduce((arr, parent) => [...arr, parent.id], []);
    const notFoundParent = parentIds.filter((x) => savedParents.indexOf(x) === -1);
    if (notFoundParent.length) {
      throw new BadRequestError(
        'Referencing unknown resource',
        notFoundParent.map((parent, i) => ({
          path: `.body.parentIds[${i}]`,
          message: `category '${parent}' does not exist`,
        })),
      );
    }
  }
  return next();
}
