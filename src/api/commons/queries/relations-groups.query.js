import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      resourceId: 1,
      name: 1,
      accepts: 1,
      otherNames: { $ifNull: ['$otherNames', []] },
      priority: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];
