import { objectCatalogue } from '../../commons/monster';

export function setCreationDefaultValues(req, res, next) {
  req.body = { ...req.body, status: 'draft' };
  return next();
}

export async function setPutIdInContext(req, res, next) {
  const id = await objectCatalogue.setUniqueId(req.params.id, 'structures');
  req.ctx = { ...req.ctx, id };
  return next();
}
