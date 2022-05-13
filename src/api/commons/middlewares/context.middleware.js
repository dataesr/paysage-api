import { objectCatalog, internalCatalog } from '../monster';

export function patchContext(req, res, next) {
  req.context = { updatedBy: req.currentUser.id, updatedAt: new Date() };
  return next();
}

export function createContext(req, res, next) {
  req.context = { createdBy: req.currentUser.id, createdAt: new Date() };
  return next();
}

export function setPutIdInContext(type) {
  return async (req, res, next) => {
    const id = await objectCatalog.setUniqueId(req.params.id, type);
    req.context = { ...req.context, id };
    return next();
  };
}

export function setGeneratedObjectIdInContext(type) {
  return async (req, res, next) => {
    const id = await objectCatalog.getUniqueId(type);
    req.context = { ...req.context, id };
    return next();
  };
}

export function setGeneratedInternalIdInContext(type) {
  return async (req, res, next) => {
    const id = await internalCatalog.getUniqueId(type);
    req.context = { ...req.context, id };
    return next();
  };
}
