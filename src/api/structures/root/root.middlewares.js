export const setDefaultStatus = (status) => (req, res, next) => {
  req.body = { ...req.body, status };
  return next();
};
