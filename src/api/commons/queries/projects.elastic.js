export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        nameFr: '$nameFr',
        nameEn: '$nameEn',
        fullNameFr: '$fullNameFr',
        fullNameEn: '$fullNameEn',
        acronymFr: '$acronymFr',
        acronymEn: '$acronymEn',
      }],
      acronym: { $ifNull: ['$acronymFr', null] },
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $ifNull: ['$nameFr', null] },
      startDate: { $ifNull: ['$startDate', null] },
    },
  },
];
