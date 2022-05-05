import { NotFoundError, ServerError } from '../../../libs/http-errors';
import pricesRepository from '../prices.repository';
import { readQuery } from '../prices.queries';

export default async function getPrice(req, res, next) {
  const id = req.params.id || req.ctx.id;
  const resource = await pricesRepository.get(id, { useQuery: readQuery })
    .catch(() => { throw new ServerError(); });
  if (!resource) throw new NotFoundError();
  if (req.method === 'POST') {
    res.status(201).json(resource);
    return next();
  }
  res.status(200).json(resource);
  return next();
}
