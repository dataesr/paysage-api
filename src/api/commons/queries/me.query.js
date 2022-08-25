import metas from './metas.query';

export default [
  ...metas,
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
    },
  },
];
