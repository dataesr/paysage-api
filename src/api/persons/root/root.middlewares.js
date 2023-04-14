import { client, db } from '../../../services/mongo.service';
import { NotFoundError } from '../../commons/http-errors';
import { personsRepository } from '../../commons/repositories';

export const deletePerson = async (req, res, next) => {
  const { id: resourceId } = req.params;
  const resource = await personsRepository.get(resourceId);
  if (!resource?.id) throw new NotFoundError();
  const session = client.startSession();
  await session.withTransaction(async () => {
    await db.collection('identifiers').deleteMany({ resourceId });
    await db.collection('socialmedias').deleteMany({ resourceId });
    await db.collection('weblinks').deleteMany({ resourceId });
    await db.collection('relationships').deleteMany({ $or: [{ resourceId }, { relatedObjectId: resourceId }] });
    await db.collection('relationships').updateMany({ otherAssociatedObjectIds: resourceId }, { $pull: { otherAssociatedObjectIds: resourceId } });
    await db.collection('documents').updateMany({ relatesTo: resourceId }, { $pull: { relatesTo: resourceId } });
    await db.collection('followups').updateMany({ relatesTo: resourceId }, { $pull: { relatesTo: resourceId } });
    await db.collection('officialtexts').updateMany({ relatesTo: resourceId }, { $pull: { relatesTo: resourceId } });
    await db.collection('press').updateMany(
      { $or: [{ relatesTo: resourceId }, { matchedWith: resourceId }] },
      { $pull: { relatesTo: resourceId, matchedWith: resourceId } },
    );
    await db.collection('persons').deleteOne({ id: resourceId });
    await session.endSession();
  });
  res.status(204).json();
  return next();
};
