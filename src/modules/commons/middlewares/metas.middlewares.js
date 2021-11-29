import { getUniqueId } from '../services/ids.service';

export async function addInsertMetaToPayload(req, res, next) {
  const id = await getUniqueId();
  req.body = {
    id,
    updatedAt: new Date(),
    createdAt: new Date(),
    updatedBy: req.body.currentUser.id,
    createdBy: req.body.currentUser.id,
    ...req.body,
  };
  return next();
}

export function addUpdateMetaToPayload(req, res, next) {
  req.body = {
    updatedAt: new Date(),
    updatedBy: req.currentUser.id,
    ...req.body,
  };
  return next();
}
