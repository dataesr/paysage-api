import metas from './metas.query';

export default [
  ...metas,
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
      id: 1,
      nameFr: 1,
      nameEn: { $ifNull: ['$nameEn', null] },
      originalId: { $ifNull: ['$originalId', null] },
      geometry: { $ifNull: ['$geometry', null] },
      level: { $ifNull: ['$level', null] },
      priority: { $ifNull: ['$priority', null] },
      parent: { $ifNull: ['$parent', null] },
      academyParent: { $ifNull: ['$academyParent', null] },
      wikidata: { $ifNull: ['$wikidata', null] },
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];
