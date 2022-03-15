export function setDefaultValues(req, res, next) {
  req.body = { ...req.body, status: 'draft' };
  return next();
}
