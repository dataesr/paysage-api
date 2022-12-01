import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      name: 1,
      email: 1,
      organization: { $ifNull: ['$organization', null]},
      fonction: { $ifNull: ['$fonction', null]},
      message: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    }
  },
];