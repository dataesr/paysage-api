import { BadRequestError, UnauthorizedError } from '../commons/http-errors';
// import { catalogRepository } from '../commons/repositories';
import readQuery from '../commons/queries/official-texts.query';
import { officialtextsRepository as repository } from '../commons/repositories';

export async function validatePayload(req, res, next) {
  if (!req.body || !Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  // const { relatesTo } = req.body;
  // if (!relatesTo) return next();
  // const { data } = await catalogRepository.find({ filters: { _id: { $in: relatesTo } } });
  // const exists = data.reduce((arr, obj) => [...arr, obj._id], []);
  // const notFound = relatesTo.filter((x) => exists.indexOf(x) === -1);
  // if (notFound.length) {
  //   throw new BadRequestError(
  //     'Referencing unknown resource',
  //     notFound.map((obj, i) => ({
  //       path: `.body.relatesTo[${i}]`,
  //       message: `Reference error: '${obj}' does not exist`,
  //     })),
  //   );
  // }
  return next();
}

export async function canIDelete(req, res, next) {
  const resource = await repository.get(req.params.id, { useQuery: readQuery });
  if (
    ((resource?.relatedStructures || []).lenght > 0)
      || ((resource?.relatedCategories || []).lenght > 0)
      || ((resource?.relatedPersons || []).lenght > 0)
      || ((resource?.relatedPrizes || []).lenght > 0)
      || ((resource?.relatedProjects || []).lenght > 0)
      || ((resource?.relatedTerms || []).lenght > 0)
  ) throw new UnauthorizedError();
  return next();
}
