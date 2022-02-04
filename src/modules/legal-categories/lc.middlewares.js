import { BadRequestError } from '../commons/errors';
import officialDocumentRepository from '../official-documents/od.repository';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const { officialDocumentId } = req.body;
  if (!officialDocumentId) return next();
  const exists = await officialDocumentRepository.get(
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
  return next();
}
