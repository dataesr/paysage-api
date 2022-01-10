import { NotFoundError, Redirected } from '../../commons/errors';
import db, { client } from '../../commons/services/database.service';
import { getUniqueId } from '../../commons/services/ids.service';

const pipeline = [
  {
    $lookup: {
      from: 'users',
      localField: 'createdBy',
      foreignField: 'id',
      as: 'user',
    },
  },
  { $set: { user: { $arrayElemAt: ['$user', 0] } } },
  { $set: { createdBy: { id: '$user.id', username: '$user.username', avatar: '$user.avatar' } } },
  {
    $lookup: {
      from: 'users',
      localField: 'updatedBy',
      foreignField: 'id',
      as: 'user',
    },
  },
  { $set: { user: { $arrayElemAt: ['$user', 0] } } },
  { $set: { updatedBy: { id: '$user.id', username: '$user.username', avatar: '$user.avatar' } } },
  { $project: { _id: 0, user: 0, __status: 0 } },
];

export async function createStructure(data) {
  const session = client.startSession();
  const id = await getUniqueId();
  const _data = { id, __status: { status: 'draft' }, ...data };
  await session.withTransaction(async () => {
    await db.collection('structures').insertOne(_data, { session });
    await db.collection('event-store').insertOne({
      userId: data.createdBy,
      timestamp: '$$NOW',
      action: 'create',
      resource: `/structures/${id}`,
      prevState: null,
      nextState: _data,
    }, { session });
  });
  session.endSession();
  return { id };
}

export async function getStructureById(structureId) {
  const structure = await db.collection('structures').findOne(
    { id: structureId, '__status.targetId': { $exists: true } },
  );
  if (structure?.__status.targetId) throw new Redirected('Resource redirected', { location: `/structures/${__status.targetId}` });
  const _pipeline = [
    { $match: { id: structureId } },
    ...pipeline,
  ];
  const data = await db.collection('structures').aggregate(_pipeline).toArray();
  if (!data.length) throw new NotFoundError();
  return data[0];
}
