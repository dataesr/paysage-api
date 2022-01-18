import BaseRepo from './base.repo';

const userPipeline = [
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: 'id',
      as: 'user',
    },
  },
  { $set: { user: { $arrayElemAt: ['$user', 0] } } },
  {
    $set: {
      user:
      {
        id:
          { $ifNull: ['$user.id', null] },
        username: { $ifNull: ['$user.username', null] },
        avatar: { $ifNull: ['$user.avatar', null] },
      },
    },
  },
  { $project: { userId: 0, _id: 0 } },
];

class EventRepository extends BaseRepo {
  // async insert(data, { session = null } = {}) {
  //   const {}
  //   await this._collection.insertOne(data, { session });
  //   return data.id;
  // }
}

export default new EventRepository({ collection: 'events', pipeline: userPipeline });
