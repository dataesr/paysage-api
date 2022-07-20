import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      resourceId: 1,
      officialName: 1,
      usualName: { $ifNull: ['$usualName', null] },
      shortName: { $ifNull: ['$shortName', null] },
      brandName: { $ifNull: ['$brandName', null] },
      nameEn: { $ifNull: ['$nameEn', null] },
      acronymFr: { $ifNull: ['$acronymFr', null] },
      acronymEn: { $ifNull: ['$acronymEn', null] },
      acronymLocal: { $ifNull: ['$acronymEn', null] },
      otherNames: { $ifNull: ['$otherNames', []] },
      startDate: { $ifNull: ['$startDate', null] },
      endDate: { $ifNull: ['$endDate', null] },
      comment: { $ifNull: ['$comment', null] },
      article: { $ifNull: ['$article', null] },
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];
