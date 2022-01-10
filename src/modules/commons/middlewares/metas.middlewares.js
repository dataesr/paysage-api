export async function addInsertMetaToPayload(req, res, next) {
  req.body = {
    updatedBy: req.currentUser.id,
    createdBy: req.currentUser.id,
    updatedAt: new Date(),
    createdAt: new Date(),
    ...req.body,
  };
  return next();
}

export function addUpdateMetaToPayload(req, res, next) {
  req.body = {
    updatedBy: req.currentUser.id,
    updatedAt: new Date(),
    ...req.body,
  };
  return next();
}
