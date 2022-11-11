export default [
  {
    $lookup: {
      from: 'identifiers',
      localField: 'id',
      foreignField: 'resourceId',
      as: 'identifiers',
      pipeline: [{
        $match: {
          $expr: {
            $and: [
              { $eq: ['$active', true] },
              { $in: ['$type', ['Wikidata']] },
            ],
          },
        },
      }],
    },
  },
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        acronymFr: { $ifNull: ['$acronymFr', null] },
        identifiers: { $ifNull: ['$identifiers.value', null] },
        otherNamesEn: { $ifNull: ['$otherNamesEn', null] },
        otherNamesFr: { $ifNull: ['$otherNamesFr', null] },
        pluralNameFr: { $ifNull: ['$pluralNameFr', null] },
        shortNameEn: { $ifNull: ['$shortNameEn', null] },
        shortNameFr: { $ifNull: ['$shortNameFr', null] },
        usualNameEn: { $ifNull: ['$usualNameEn', null] },
        usualNameFr: { $ifNull: ['$usualNameFr', null] },
      }],
      acronym: { $ifNull: ['$acronymFr', null] },
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $ifNull: ['$pluralNameFr', '$usualNameFr', null] },
    },
  },
];
