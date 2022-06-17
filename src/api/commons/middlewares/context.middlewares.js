import catalog from '../catalog';

export function patchContext(req, res, next) {
  req.context = { updatedBy: req.currentUser.id, updatedAt: new Date() };
  return next();
}

export function createContext(req, res, next) {
  req.context = { createdBy: req.currentUser.id, createdAt: new Date() };
  return next();
}

export function setPutIdInContext(collection) {
  return async (req, res, next) => {
    const id = await catalog.setUniqueId(req.params.id, collection);
    req.context = { ...req.context, id };
    return next();
  };
}

export function setGeneratedObjectIdInContext(collection) {
  return async (req, res, next) => {
    const id = await catalog.getUniqueId(collection, 5);
    req.context = { ...req.context, id };
    return next();
  };
}

export function setGeneratedInternalIdInContext(collection) {
  return async (req, res, next) => {
    const id = await catalog.getUniqueId(collection, 15);
    req.context = { ...req.context, id };
    return next();
  };
}
