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
    $lookup: {
      from: 'relationships',
      localField: 'id',
      foreignField: 'resourceId',
      as: 'relationships',
      pipeline: [{ $match: { relationTag: 'projet-categorie' } }],
    },
  },
  { $set: { relationships: '$relationships.relatedObjectId' } },
  {
    $lookup: {
      from: 'categories',
      localField: 'relationships',
      foreignField: 'id',
      as: 'categories',
      pipeline: [{ $sort: { priority: 1 } }],
    },
  },
  { $set: { category: { $arrayElemAt: ['$categories', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      acronym: { $ifNull: ['$acronymFr', null] },
      acronymEn: { $ifNull: ['$acronymEn', null] },
      acronymFr: { $ifNull: ['$acronymFr', null] },
      category: { $ifNull: ['$category.usualNameFr', null] },
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
