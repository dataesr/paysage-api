import { BadRequestError, ForbiddenError } from '../commons/http-errors';
import {
  catalogRepository,
  followUpsRepository,
  usersRepository,
} from '../commons/repositories';

export async function canUserEdit(req, res, next) {
  const { canEdit, createdBy } = followUpsRepository.find(req.params.id);
  const { id, groups = [] } = usersRepository.find(req.currentUser.id);
  const permissions = [id, ...groups]
    .filter((x) => [...canEdit, createdBy].indexOf(x) === -1);
  if (permissions.length) return next();
  throw new ForbiddenError();
}

const ALLOWED_COLLECTIONS = [
  'structures',
  'persons',
  'terms',
  'catgories',
  'prices',
  'projects',
];

export async function validatePayload(req, res, next) {
  if (!req.body || !Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const errors = [];
  const { relatesTo } = req.body;
  if (!relatesTo) return next();
  const { data } = await catalogRepository.find({
    filters: { $and: [
      { _id: { $in: relatesTo } },
      { collection: { $in: ALLOWED_COLLECTIONS } },
    ] },
  });
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
