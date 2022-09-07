export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        longNameFr: '$longNameFr',
        shortNameFr: '$shortNameFr',
        acronymFr: '$acronymFr',
        pluralNameFr: '$pluralNameFr',
        longNameEn: '$longNameEn',
        shortNameEn: '$shortNameEn',
        otherNames: '$otherNames',
      }],
      name: { $ifNull: ['$longNameFr', null] },
      acronym: { $ifNull: ['$acronymFr', null] },
    },
  },
];
