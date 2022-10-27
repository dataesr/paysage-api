import usersLightQuery from './users.light.query';

export default [
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
  { $project: { _id: 0 } },
];
