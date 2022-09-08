import { BadRequestError, UnauthorizedError } from '../commons/http-errors';
import readQuery from '../commons/queries/legal-categories.elastic';
import { legalcategoriesRepository as repository, officialtextsRepository } from '../commons/repositories';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const { officialTextId } = req.body;
  if (!officialTextId) return next();
  const exists = await officialtextsRepository.get(officialTextId);
  if (!exists) {
    throw new BadRequestError(
      'Referencing unknown resource',
      [{
        path: '.body.officialTextId',
        message: `official text '${officialTextId}' does not exist`,
      }],
    );
  }
  return next();
}

export async function canIDelete(req, res, next) {
  const resource = await repository.get(req.params.id, { useQuery: readQuery });
  if (
    (resource?.officialText?.id || false)
  ) throw new UnauthorizedError();
  return next();
}
