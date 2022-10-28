export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        acronymEn: { $ifNull: ['$acronymEn', null] },
        acronymFr: { $ifNull: ['$acronymFr', null] },
        fullNameEn: { $ifNull: ['$fullNameEn', null] },
        fullNameFr: { $ifNull: ['$fullNameFr', null] },
        nameEn: { $ifNull: ['$nameEn', null] },
        nameFr: { $ifNull: ['$nameFr', null] },
      }],
      acronym: { $ifNull: ['$acronymFr', null] },
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $ifNull: ['$nameFr', null] },
      startDate: { $ifNull: ['$startDate', null] },
    },
  },
];
