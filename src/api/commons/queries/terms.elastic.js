export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        acronymFr: '$acronymFr',
        otherNamesEn: '$otherNamesEn',
        otherNamesFr: '$otherNamesFr',
        pluralNameFr: '$pluralNameFr',
        shortNameEn: '$shortNameEn',
        shortNameFr: '$shortNameFr',
        usualNameEn: '$usualNameEn',
        usualNameFr: '$usualNameFr',
      }],
      acronym: { $ifNull: ['$acronymFr', null] },
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $ifNull: ['$usualNameFr', null] },
    },
  },
];
