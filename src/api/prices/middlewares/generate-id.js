import { objectCatalog } from '../../commons/monster';

export default async function generateId(req, res, next) {
  if (!req.ctx) { req.ctx = {}; }
  req.ctx.id = await objectCatalog.getUniqueId('prices');
  return next();
}
