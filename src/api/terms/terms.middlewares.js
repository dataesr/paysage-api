import { BadRequestError } from '../../libs/http-errors';
import terms from './terms.resource';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const { parentIds } = req.body;
  if (!parentIds) return next();
  const { data } = await terms.repository.find({ filters: { id: { $in: parentIds } }, useQuery: 'checkQuery' });
  const savedParents = data.reduce((arr, parent) => [...arr, parent.id], []);
  const notFoundParent = parentIds.filter((x) => savedParents.indexOf(x) === -1);
  if (notFoundParent.length) {
    throw new BadRequestError(
      'Referencing unknown resource',
      notFoundParent.map((parent, i) => ({
        path: `.body.parentIds[${i}]`,
        message: `term '${parent}' does not exist`,
      })),
    );
  }
  return next();
}
