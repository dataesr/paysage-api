export const setConfirmToContext = (req, res, next) => {
  req.context = { ...req.context, confirmed: true };
  return next();
};
