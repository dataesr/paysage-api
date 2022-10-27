export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        acronymFr: 1,
        id: 1,
        longNameEn: 1,
        longNameFr: 1,
        otherNames: 1,
        pluralNameFr: 1,
        shortNameEn: 1,
        shortNameFr: 1,
      }],
      acronym: { $ifNull: ['$acronymFr', null] },
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $ifNull: ['$longNameFr', null] },
    },
  },
];
