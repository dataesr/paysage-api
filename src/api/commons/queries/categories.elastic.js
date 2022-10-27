export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        acronymFr: 1,
        id: 1,
        otherNamesEn: 1,
        otherNamesFr: 1,
        pluralNameFr: 1,
        shortNameEn: 1,
        shortNameFr: 1,
        usualNameEn: 1,
        usualNameFr: 1,
      }],
      acronym: { $ifNull: ['$acronymFr', null] },
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $ifNull: ['$usualNameFr', null] },
    },
  },
];
