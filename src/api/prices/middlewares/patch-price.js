import { ServerError } from '../../../libs/http-errors';
import pricesRepository from '../prices.repository';

export default async function patchPrice(req, res, next) {
  const { id } = req.params;
  const data = { ...req.ctx, ...req.body };
  const { ok } = await pricesRepository.patch(id, data);
  if (!ok) throw new ServerError();
  return next();
}
