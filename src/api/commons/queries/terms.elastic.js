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
      acronym: { $ifNull: ['$acronymFr', null] },
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $ifNull: ['$usualNameFr', null] },
    },
  },
];
