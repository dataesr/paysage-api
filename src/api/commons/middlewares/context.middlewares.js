import { objectCatalog, internalCatalog } from '../monster';

export function patchCtx(req, res, next) {
  req.ctx = { updatedBy: req.currentUser.id, updatedAt: new Date() };
  return next();
}

export function createCtx(req, res, next) {
  req.ctx = { createdBy: req.currentUser.id, createdAt: new Date() };
  return next();
}

export function setPutIdInContext(type) {
  return async (req, res, next) => {
    const id = await objectCatalog.setUniqueId(req.params.id, type);
    req.ctx = { ...req.ctx, id };
    return next();
  };
}

export function setGeneratedObjectIdInContext(type) {
  return async (req, res, next) => {
    const id = await objectCatalog.getUniqueId(type);
    req.ctx = { ...req.ctx, id };
    return next();
  };
}

export function setGeneratedInternalIdInContext(type) {
  return async (req, res, next) => {
    const id = await internalCatalog.getUniqueId(type);
    req.ctx = { ...req.ctx, id };
    return next();
  };
}
