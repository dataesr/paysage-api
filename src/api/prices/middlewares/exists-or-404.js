import { NotFoundError } from '../../../libs/http-errors';
import pricesRepository from '../prices.repository';
import { checkQuery } from '../prices.queries';

export default async function existsOr404(req, res, next) {
  const { id } = req.params;
  const exists = await pricesRepository.get(id, { useQuery: checkQuery });
  if (!exists) throw new NotFoundError();
  return next();
}
