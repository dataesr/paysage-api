export default [
  {
    $lookup: {
      from: 'geographicalcategories',
      localField: 'parentOriginalId',
      foreignField: 'originalId',
      pipeline: [{
        $project: {
          _id: 0,
          id: 1,
          level: 1,
          nameEn: { $ifNull: ['$nameEn', null] },
          nameFr: { $ifNull: ['$nameFr', null] },
          originalId: 1,
          parentOriginalId: { $ifNull: ['$parentOriginalId', null] },
        },
      }],
      as: 'parent',
    },
  },
  { $set: { parent: { $arrayElemAt: ['$parent', 0] } } },
  {
    $lookup: {
      from: 'geographicalcategories',
      localField: 'originalId',
      foreignField: 'parentOriginalId',
      pipeline: [{
        $project: {
          _id: 0,
          id: 1,
          level: 1,
          nameEn: { $ifNull: ['$nameEn', null] },
          nameFr: { $ifNull: ['$nameFr', null] },
          originalId: 1,
          parentOriginalId: { $ifNull: ['$parentOriginalId', null] },
        },
      }],
      as: 'children',
    },
  },
  {
    $project: {
      _id: 0,
      academyParent: { $ifNull: ['$academyParent', null] },
      children: { $ifNull: ['$children', null] },
      geometry: { $ifNull: ['$geometry', null] },
      id: 1,
      level: { $ifNull: ['$level', null] },
      nameEn: { $ifNull: ['$nameEn', null] },
      nameFr: 1,
      originalId: { $ifNull: ['$originalId', null] },
      parent: { $ifNull: ['$parent', null] },
      priority: { $ifNull: ['$priority', null] },
      wikidata: { $ifNull: ['$wikidata', null] },
    },
  },
];
