export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        acronymEn: 1,
        acronymFr: 1,
        fullNameEn: 1,
        fullNameFr: 1,
        nameEn: 1,
        nameFr: 1,
      }],
      acronym: { $ifNull: ['$acronymFr', null] },
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $ifNull: ['$nameFr', null] },
      startDate: { $ifNull: ['$startDate', null] },
    },
  },
];
