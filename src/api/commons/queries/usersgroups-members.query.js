import metas from './metas.query';
import userLightQuery from './users.light.query';

export default [
  ...metas,
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: 'id',
      pipeline: userLightQuery,
      as: 'user',
    },
  },
  { $set: { user: { $arrayElemAt: ['$user', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      userId: 1,
      user: 1,
      role: 1,
      confirmed: 1,
    },
  },
];
