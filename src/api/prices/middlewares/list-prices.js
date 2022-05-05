import pricesRepository from '../prices.repository';
import { readQuery } from '../prices.queries';

export default async function listPrices(req, res, next) {
  const { query } = req;
  const { data, totalCount } = await pricesRepository.find({ ...query, useQuery: readQuery });
  res.status(200).json({ data, totalCount: totalCount || 0 });
  return next();
}
