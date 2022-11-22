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
      acronym: { $ifNull: ['$acronymFr', null] },
      acronymEn: { $ifNull: ['$acronymEn', null] },
      acronymFr: { $ifNull: ['$acronymFr', null] },
      fullNameEn: { $ifNull: ['$fullNameEn', null] },
      fullNameFr: { $ifNull: ['$fullNameFr', null] },
      identifiers: { $ifNull: ['$identifiers.value', null] },
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $ifNull: ['$nameFr', null] },
      nameEn: { $ifNull: ['$nameEn', null] },
      nameFr: { $ifNull: ['$nameFr', null] },
      startDate: { $ifNull: ['$startDate', null] },
    },
  },
];
