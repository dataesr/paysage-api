import db from '../modules/commons/services/database.service';

export default async function setupDatabase() {
  await db.collection('structures').createIndex({ id: 1 }, { unique: true });
  await db.collection('categories').createIndex({ id: 1 }, { unique: true });
  await db.createCollection('categories-view', {
    viewOn: 'categories',
    pipeline: [
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
      { $project: { _id: 0, user: 0 } },
    ],
  });
  // TODO: Add validation at the database level here ?
}
