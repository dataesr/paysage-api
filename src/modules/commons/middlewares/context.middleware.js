export async function patchCtx(req, res, next) {
  req.ctx = { updatedBy: req.currentUser.id, updatedAt: new Date() };
  return next();
}

export async function createCtx(req, res, next) {
  req.ctx = { createdBy: req.currentUser.id, createdAt: new Date() };
  return next();
}
