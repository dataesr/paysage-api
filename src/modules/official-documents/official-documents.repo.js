import BaseRepo from '../commons/repositories/base.repo';

const metasPipeline = [
  {
    $lookup: {
      from: 'users',
      localField: 'createdBy',
      foreignField: 'id',
      as: 'user',
    },
  },
  { $set: { user: { $arrayElemAt: ['$user', 0] } } },
  {
    $set: {
      createdBy:
      {
        id:
          { $ifNull: ['$user.id', null] },
        username: { $ifNull: ['$user.username', null] },
        avatar: { $ifNull: ['$user.avatar', null] },
      },
    },
  },
  {
    $lookup: {
      from: 'users',
      localField: 'updatedBy',
      foreignField: 'id',
      as: 'user',
    },
  },
  { $set: { user: { $arrayElemAt: ['$user', 0] } } },
  {
    $set: {
      updatedBy:
      {
        id:
          { $ifNull: ['$user.id', null] },
        username: { $ifNull: ['$user.username', null] },
        avatar: { $ifNull: ['$user.avatar', null] },
      },
    },
  },
  { $project: { user: 0 } },
];

class OfficialDocumentsRepository extends BaseRepo {}

export default new OfficialDocumentsRepository({
  collection: 'official-documents',
  pipeline: [
    ...metasPipeline,
    { $project: { _id: 0 } },
  ],
});
