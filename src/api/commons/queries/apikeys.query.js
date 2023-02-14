import metas from './metas.query';
import usersLightQuery from './users.light.query';

export const onCreateApiKeyQuery = [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      name: 1,
      role: 1,
      apiKey: 1,
      userId: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];

export const onListApiKeyQuery = [
  ...metas,
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: 'id',
      pipeline: usersLightQuery,
      as: 'user',
    },
  },
  { $set: { user: { $arrayElemAt: ['$user', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      name: 1,
      role: 1,
      userId: 1,
      user: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];
