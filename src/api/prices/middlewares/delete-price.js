import { ServerError } from '../../../libs/http-errors';
import pricesRepository from '../prices.repository';

export default async function deletePrice(req, res, next) {
  const { id } = req.params;
  const { ok } = await pricesRepository.remove(id);
  if (!ok) throw new ServerError();
  res.status(204).json();
  return next();
}
