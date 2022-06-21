import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      legend: { $ifNull: ['$legend', null] },
      credits: { $ifNull: ['$credits', null] },
      license: { $ifNull: ['$license', null] },
      startDate: { $ifNull: ['$startDate', null] },
      endDate: { $ifNull: ['$endDate', null] },
      comment: { $ifNull: ['$comment', null] },
      url: 1,
      mimetype: 1,
      originalName: 1,
      path: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];
