import { BadRequestError } from '../commons/http-errors';
import { catalogRepository } from '../commons/repositories';

export async function validatePayload(req, res, next) {
  if (!req.body || !Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const { relatesTo } = req.body;
  if (!relatesTo) return next();
  const { data } = await catalogRepository.find({ filters: { _id: { $in: relatesTo } } });
  const exists = data.reduce((arr, obj) => [...arr, obj._id], []);
  const notFound = relatesTo.filter((x) => exists.indexOf(x) === -1);
  if (notFound.length) {
    throw new BadRequestError(
      'Referencing unknown resource',
      notFound.map((obj, i) => ({
        path: `.body.relatesTo[${i}]`,
        message: `Reference error: '${obj}' does not exist`,
      })),
    );
  }
  return next();
}
