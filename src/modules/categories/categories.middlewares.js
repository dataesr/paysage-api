import { BadRequestError } from '../../libs/monster/errors';
import { objectCatalogue } from '../commons/monster';
import officialDocument from '../official-documents/od.resource';
import categories from './categories.resource';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const { officialDocumentId, parentIds } = req.body;
  if (officialDocumentId) {
    const exists = await officialDocument.repository.get(
      officialDocumentId,
      { useQuery: 'checkQuery' },
    );
    if (!exists) {
      throw new BadRequestError(
        'Referencing unknown resource',
        [{
          path: '.body.officialDocumentId',
          message: `official document '${officialDocumentId}' does not exist`,
        }],
      );
    }
  }
  if (parentIds) {
    const { data } = await categories.repository.find({ filters: { id: { $in: parentIds } }, useQuery: 'checkQuery' });
    const savedParents = data.reduce((arr, parent) => [...arr, parent.id], []);
    const notFoundParent = parentIds.filter((x) => savedParents.indexOf(x) === -1);
    if (notFoundParent.length) {
      throw new BadRequestError(
        'Referencing unknown resource',
        notFoundParent.map((parent, i) => ({
          path: `.body.parentIds[${i}]`,
          message: `category '${parent}' does not exist`,
        })),
      );
    }
  }
  return next();
}

export async function setPutIdInContext(req, res, next) {
  const id = await objectCatalogue.setUniqueId(req.params.id, 'structures');
  req.ctx = { ...req.ctx, id };
  return next();
}
