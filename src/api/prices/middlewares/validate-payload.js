import { BadRequestError } from '../../../libs/http-errors';
import pricesRepository from '../prices.repository';
import { checkQuery } from '../prices.queries';

async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const { parentIds } = req.body;
  if (!parentIds) return next();
  const { data } = await pricesRepository.find({ filters: { id: { $in: parentIds } }, useQuery: checkQuery });
  const savedParents = data.reduce((arr, parent) => [...arr, parent.id], []);
  const notFoundParent = parentIds.filter((x) => savedParents.indexOf(x) === -1);
  if (notFoundParent.length) {
    throw new BadRequestError(
      'Referencing unknown resource',
      notFoundParent.map((parent, i) => ({
        path: `.body.parentIds[${i}]`,
        message: `price '${parent}' does not exist`,
      })),
    );
  }
  return next();
}

export default validatePayload;
