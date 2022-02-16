export function setCreationDefaultValues(req, res, next) {
  req.body = { ...req.body, status: 'draft' };
  return next();
}

export function setPutIdInContext(req, res, next) {
  req.ctx = { ...req.ctx, id: req.params.id };
  return next();
}
