import { client, db } from '../../services/mongo.service';
import { BadRequestError, NotFoundError } from '../commons/http-errors';
import { officialtextsRepository } from '../commons/repositories';

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

export async function deleteOfficialText(req, res, next) {
  const { id: resourceId } = req.params;
  const resource = await officialtextsRepository.get(resourceId);
  if (!resource?.id) throw new NotFoundError();
  const session = client.startSession();
  await session.withTransaction(async () => {
    await db.collection('relationships').updateMany({ startDateOfficialTextId: resourceId }, { $unset: { startDateOfficialTextId: '' } });
    await db.collection('relationships').updateMany({ endDateOfficialTextId: resourceId }, { $unset: { endDateOfficialTextId: '' } });
    await db.collection('structures').updateMany({ creationOfficialTextId: resourceId }, { $unset: { creationOfficialTextId: '' } });
    await db.collection('structures').updateMany({ closureOfficialTextId: resourceId }, { $unset: { closureOfficialTextId: '' } });
    await db.collection('categories').updateMany({ creationOfficialTextId: resourceId }, { $unset: { creationOfficialTextId: '' } });
    await db.collection('categories').updateMany({ closureOfficialTextId: resourceId }, { $unset: { closureOfficialTextId: '' } });
    await db.collection('terms').updateMany({ creationOfficialTextId: resourceId }, { $unset: { creationOfficialTextId: '' } });
    await db.collection('terms').updateMany({ closureOfficialTextId: resourceId }, { $unset: { closureOfficialTextId: '' } });
    await db.collection('legalcategories').updateMany({ officialTextId: resourceId }, { $unset: { officialTextId: '' } });
    await db.collection('officialtexts').deleteOne({ id: resourceId });
    await session.endSession();
  });
  res.status(204).json();
  return next();
}
