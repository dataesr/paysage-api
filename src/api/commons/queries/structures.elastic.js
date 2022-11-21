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
              { $in: ['$type', ['idRef', 'RNSR', 'Siret', 'UAI', 'Wikidata']] },
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
      acronym: { $ifNull: ['$currentName.acronymFr', null] },
      creationDate: { $ifNull: ['$creationDate', null] },
      identifiers: { $ifNull: ['$identifiers.value', null] },
      isDeleted: { $ifNull: ['$isDeleted', false] },
      locality: { $ifNull: ['$localisations.locality', null] },
      name: { $ifNull: ['$currentName.usualName', null] },
      names: { $ifNull: ['$names', null] },
      shortName: { $ifNull: ['$currentName.shortName', null] },
    },
  },
];
