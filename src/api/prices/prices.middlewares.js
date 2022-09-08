import { BadRequestError, UnauthorizedError } from '../commons/http-errors';
import readQuery from '../commons/queries/prices.elastic';
import { officialtextsRepository, pricesRepository as repository } from '../commons/repositories';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const errors = [];
  const { creationOfficialTextId, closureOfficialTextId } = req.body;
  if (creationOfficialTextId) {
    const text = await officialtextsRepository.get(creationOfficialTextId);
    if (!text?.id) { errors.push({ path: '.body.creationOfficialTextId', message: `official text ${creationOfficialTextId} does not exist` }); }
  }
  if (closureOfficialTextId) {
    const text = await officialtextsRepository.get(closureOfficialTextId);
    if (!text?.id) { errors.push({ path: '.body.closureOfficialTextId', message: `official text ${closureOfficialTextId} does not exist` }); }
  }
  if (errors.length) throw new BadRequestError('Validation failed', errors);
  return next();
}

export async function canIDelete(req, res, next) {
  const resource = await repository.get(req.params.id, { useQuery: readQuery });
  if (
    ((resource?.parents || []).lenght > 0)
  ) throw new UnauthorizedError();
  return next();
}
