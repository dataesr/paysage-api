export function setFilters(req, res, next) {
  const { dataset } = req.params;
  if (!req.query.filters) { req.query.filters = {}; }
  req.query.filters.dataset = dataset;
  return next();
}
