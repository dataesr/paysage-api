import MongoRepository from '../modules/commons/repositories/mongo.repository';

const pipeline = [
  {
    $lookup: {
      from: 'users',
      localField: 'user',
      foreignField: 'id',
      as: 'user',
    },
  },
  { $set: { user: { $arrayElemAt: ['$user', 0] } } },
  {
    $set: {
      user:
      {
        id: { $ifNull: ['$user.id', null] },
        username: { $ifNull: ['$user.username', null] },
        avatar: { $ifNull: ['$user.avatar', null] },
      },
    },
  },
  { $set: { id: '$_id' } },
  { $project: { userId: 0, _id: 0 } },
];

class EventRepository extends MongoRepository {}

export default new EventRepository({ collection: 'events', models: { readModel: pipeline } });
