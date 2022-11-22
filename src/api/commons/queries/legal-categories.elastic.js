export default [
  {
    $project: {
      _id: 0,
      id: 1,
      acronym: { $ifNull: ['$acronymFr', null] },
      acronymFr: { $ifNull: ['$acronymFr', null] },
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $ifNull: ['$longNameFr', null] },
      longNameEn: { $ifNull: ['$longNameEn', null] },
      longNameFr: { $ifNull: ['$longNameFr', null] },
      otherNames: { $ifNull: ['$otherNames', null] },
      pluralNameFr: { $ifNull: ['$pluralNameFr', null] },
      shortNameEn: { $ifNull: ['$shortNameEn', null] },
      shortNameFr: { $ifNull: ['$shortNameFr', null] },
    },
  },
];
