import { client, db } from '../../services/mongo.service';
import { BadRequestError, NotFoundError } from '../commons/http-errors';
import { officialtextsRepository } from '../commons/repositories';

export async function validatePayload(req, res, next) {
  if (!req.body || !Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const { jorftext } = req.body; 
  const { id }= req.params
  if (!jorftext) return next()
  const jorftextFromDB = await officialtextsRepository.findOne({id: { $ne: id }, jorftext: jorftext})

  if (jorftextFromDB?.jorftext && typeof jorftextFromDB === 'object') {
    throw new BadRequestError(
      `Reference error: '${jorftext}' already exists`
    );
}
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
    await db.collection('documents').updateMany({ relatesTo: resourceId }, { $pull: { relatesTo: resourceId } });
    await db.collection('followups').updateMany({ relatesTo: resourceId }, { $pull: { relatesTo: resourceId } });
    await db.collection('officialtexts').updateMany({ relatesTo: resourceId }, { $pull: { relatesTo: resourceId } });
    await db.collection('press').updateMany(
      { $or: [{ relatesTo: resourceId }, { matchedWith: resourceId }] },
      { $pull: { relatesTo: resourceId, matchedWith: resourceId } },
    );
    await db.collection('officialtexts').deleteOne({ id: resourceId });
    await session.endSession();
  });
  res.status(204).json();
  return next();
}
