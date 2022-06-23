import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      nameFr: { $ifNull: ['$nameFr', null] },
      nameEn: { $ifNull: ['$nameEn', null] },
      descriptionFr: { $ifNull: ['$descriptionFr', null] },
      descriptionEn: { $ifNull: ['$descriptionEn', null] },
      startDate: { $ifNull: ['$startDate', null] },
      endDate: { $ifNull: ['$endDate', null] },
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];
