import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../commons/http-errors';
import {
  catalogRepository,
  documentsRepository,
  documentTypesRepository,
  groupMembersRepository,
} from '../commons/repositories';

export async function forbidUnauthorizedUser(req, res, next) {
  if (req.currentUser.role === 'admin') return next();
  const document = await documentsRepository.get(req.params.id);
  if (!document) throw new NotFoundError();
  if (document.isPublic) return next();
  const { data: memberships } = await groupMembersRepository.find({ filters: { userId: req.currentUser.id } });
  const canAccess = document.canAccess || [];
  if (memberships.some(({ groupId }) => canAccess.includes(groupId))) return next();
  throw new ForbiddenError();
}

export async function setViewerFilter(req, res, next) {
  if (req.currentUser.role === 'admin') return next();
  const groups = await groupMembersRepository.find({ filters: { userId: req.currentUser.id } });
  const groupsIds = (groups.data && groups?.data?.length) ? groups?.data?.map((group) => group.groupId) : [];
  const viewerFilter = {
    $or: [{ isPublic: true }, { canAccess: { $in: groupsIds } }],
  };
  req.query.filters = { $and: [viewerFilter, req.query.filters] };
  return next();
}

export async function validatePayload(req, res, next) {
  if (!req.body || !Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const errors = [];
  const { relatesTo, documentTypeId } = req.body;
  if (documentTypeId) {
    const documentType = await documentTypesRepository.get(documentTypeId);
    if (!documentType?.id) { errors.push({ path: '.body.documentTypeId', message: `documentType ${documentTypeId} does not exist` }); }
  }
  if (!relatesTo) return next();
  const { data } = await catalogRepository.find({ filters: { _id: { $in: relatesTo } } });
  const exists = data.reduce((arr, obj) => [...arr, obj._id], []);
  const notFound = relatesTo.filter((x) => exists.indexOf(x) === -1);
  if (notFound.length) {
    notFound.map((obj, i) => (errors.push({
      path: `.body.relatesTo[${i}]`,
      message: `Reference error: '${obj}' does not exist`,
    })));
  }
  if (errors.length) throw new BadRequestError('Validation failed', errors);
  return next();
}
