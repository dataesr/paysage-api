import usersLightQuery from './users.light.query';

export default [
  {
    $lookup: {
      from: 'users',
      localField: 'createdBy',
      foreignField: 'id',
      pipeline: usersLightQuery,
      as: 'createdBy',
    },
  },
  { $set: { createdBy: { $arrayElemAt: ['$createdBy', 0] } } },
  {
    $lookup: {
      from: 'users',
      localField: 'updatedBy',
      foreignField: 'id',
      pipeline: usersLightQuery,
      as: 'updatedBy',
    },
  },
  { $set: { updatedBy: { $arrayElemAt: ['$updatedBy', 0] } } },
];
