import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      resourceId: 1,
      type: 1,
      value: 1,
      active: 1,
      startDate: { $ifNull: ['$startDate', null] },
      endDate: { $ifNull: ['$endDate', null] },
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];
