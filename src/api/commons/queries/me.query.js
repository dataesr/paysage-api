import metas from './metas.query';

export default [
  ...metas,
  {
    $lookup: {
      from: 'groupmembers',
      localField: 'id',
      foreignField: 'userId',
      pipeline: [
        {
          $project: {
            _id: 0,
            groupId: 1,
          },
        },
      ],
      as: 'membership',
    },
  },
  { $set: { membership: '$membership.groupId' } },
  {
    $lookup: {
      from: 'groups',
      localField: 'membership',
      foreignField: 'id',
      pipeline: [
        {
          $project: {
            _id: 0,
            id: 1,
            name: 1,
            acronym: { $ifNull: ['$acronym', null] },
          },
        },
      ],
      as: 'groups',
    },
  },
  {
    $project: {
      _id: 0,
      id: 1,
      email: 1,
      firstName: 1,
      lastName: 1,
      role: 1,
      position: { $ifNull: ['$position', null] },
      service: { $ifNull: ['$service', null] },
      avatar: { $ifNull: ['$avatar', null] },
      groups: 1,
    },
  },
];
