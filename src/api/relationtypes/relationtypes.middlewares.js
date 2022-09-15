// import { UnauthorizedError } from '../commons/http-errors';
// import readQuery from '../commons/queries/legal-categories.elastic';
// import { relationshipsRepository as repository } from '../commons/repositories';

// export async function canIDelete(req, res, next) {
//   const resource = await repository.find(req.params.id, { useQuery: readQuery });
//   if (
//     (resource?.officialText?.id || false)
//   ) throw new UnauthorizedError();
//   return next();
// }
