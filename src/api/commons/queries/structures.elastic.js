import currentNameQuery from './current-name.query';

export default [
  ...currentNameQuery,
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
              { $in: ['$type', ['GRID', 'idRef', 'RNSR', 'ROR', 'Siret', 'UAI', 'Wikidata']] },
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
      pipeline: [{ $match: { relationTag: 'structure-categorie' } }],
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
      acronym: { $ifNull: ['$currentName.acronymFr', null] },
      category: { $ifNull: ['$category.usualNameFr', null] },
      city: { $ifNull: ['$localisations.city', null] },
      creationDate: { $ifNull: ['$creationDate', null] },
      identifiers: { $ifNull: ['$identifiers.value', null] },
      isDeleted: { $ifNull: ['$isDeleted', false] },
      locality: { $ifNull: ['$localisations.locality', null] },
      name: { $ifNull: ['$currentName.usualName', null] },
      names: { $ifNull: ['$names', null] },
      shortName: { $ifNull: ['$currentName.shortName', null] },
      structureStatus: { $ifNull: ['$structureStatus', ''] },
    },
  },
];
