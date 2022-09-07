export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        usualNameFr: '$usualNameFr',
        usualNameEn: '$usualNameEn',
        shortNameEn: '$shortNameEn',
        shortNameFr: '$shortNameFr',
        acronymFr: '$acronymFr',
        pluralNameFr: '$pluralNameFr',
        otherNamesFr: '$otherNamesFr',
        otherNamesEn: '$otherNamesEn',
      }],
      name: { $ifNull: ['$usualNameFr', null] },
      acronym: { $ifNull: ['$acronymFr', null] },
    },
  },
];
