export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        acronymFr: { $ifNull: ['$acronymFr', null] },
        longNameEn: { $ifNull: ['$longNameEn', null] },
        longNameFr: { $ifNull: ['$longNameFr', null] },
        otherNames: { $ifNull: ['$otherNames', null] },
        pluralNameFr: { $ifNull: ['$pluralNameFr', null] },
        shortNameEn: { $ifNull: ['$shortNameEn', null] },
        shortNameFr: { $ifNull: ['$shortNameFr', null] },
      }],
      acronym: { $ifNull: ['$acronymFr', null] },
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $ifNull: ['$longNameFr', null] },
    },
  },
];
