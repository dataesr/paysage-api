import metas from './metas.query';

export default [
  ...metas,
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
      closestParent: { $ifNull: ['$closestParent', null] },
      academyParent: { $ifNull: ['$academyParent', null] },
      wikidata: { $ifNull: ['$wikidata', null] },
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];
