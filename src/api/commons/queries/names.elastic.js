import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      officialName: { $ifNull: ['$usualName', null] },
      usualName: { $ifNull: ['$usualName', null] },
      shortName: { $ifNull: ['$shortName', null] },
      brandName: { $ifNull: ['$brandName', null] },
      nameEn: { $ifNull: ['$nameEn', null] },
      acronymFr: { $ifNull: ['$acronymFr', null] },
      acronymEn: { $ifNull: ['$acronymEn', null] },
      acronymLocal: { $ifNull: ['$acronymEn', null] },
      otherNames: { $ifNull: ['$otherNames', []] },
    },
  },
];
