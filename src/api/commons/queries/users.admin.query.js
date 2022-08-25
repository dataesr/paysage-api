import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      email: 1,
      role: 1,
      firstName: 1,
      lastName: 1,
      avatar: { $ifNull: ['$avatar', null] },
      service: { $ifNull: ['$service', null] },
      position: { $ifNull: ['$position', null] },
      confirmed: 1,
      deleted: { $ifNull: ['$deleted', false] },
    },
  },
];
