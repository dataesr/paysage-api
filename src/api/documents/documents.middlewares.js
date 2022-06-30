import { BadRequestError, ForbiddenError } from '../commons/http-errors';
import {
  catalogRepository,
  documentsRepository,
  documentTypesRepository,
  usersRepository,
} from '../commons/repositories';

export async function canUserEdit(req, res, next) {
  const { canEdit } = documentsRepository.find(req.params.id);
  const { id, groups = [] } = usersRepository.find(req.currentUser.id);
  const permissions = [id, ...groups].filter((x) => canEdit.indexOf(x) === -1);
  if (permissions.length) return next();
  throw new ForbiddenError();
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
