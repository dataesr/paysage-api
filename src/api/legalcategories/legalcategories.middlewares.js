import { BadRequestError } from '../commons/http-errors';
import officialTextsRepository from '../officialtexts/officialtexts.repository';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const { officialTextId } = req.body;
  if (!officialTextId) return next();
  const exists = await officialTextsRepository.get(officialTextId);
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
