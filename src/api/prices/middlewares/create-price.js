import pricesRepository from '../prices.repository';

export default async function createPrice(req, res, next) {
  const data = { ...req.ctx, ...req.body };
  await pricesRepository.create(data);
  return next();
}
