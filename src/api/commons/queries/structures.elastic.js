import currentLocalisationQuery from './current-localisation.query';
import currentNameQuery from './current-name.query';

export default [
  ...currentLocalisationQuery,
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
              { $in: ['$type', ['finess', 'grid', 'idref', 'ringgold', 'rnsr', 'ror', 'siret', 'uai', 'wikidata']] },
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
      acronymEn: { $ifNull: ['$currentName.acronymEn', null] },
      acronymFr: { $ifNull: ['$currentName.acronymFr', null] },
      acronymLocal: { $ifNull: ['$currentName.acronymLocal', null] },
      brandName: { $ifNull: ['$currentName.brandName', null] },
      category: { $ifNull: ['$category.usualNameFr', null] },
      city: { $ifNull: ['$localisations.city', null] },
      closureDate: { $ifNull: ['$closureDate', null] },
      creationDate: { $ifNull: ['$creationDate', null] },
      id: 1,
      identifiers: { $ifNull: ['$identifiers.value', null] },
      isDeleted: { $ifNull: ['$isDeleted', false] },
      // localisation: { $ifNull: ['$localisations.coordinates', null] },
      coordinates: { $ifNull: ['$currentLocalisation.geometry.coordinates', null] },
      locality: { $ifNull: ['$localisations.locality', null] },
      name: { $ifNull: ['$currentName.usualName', null] },
      nameEn: { $ifNull: ['$currentName.nameEn', null] },
      names: { $ifNull: ['$names', null] },
      officialName: { $ifNull: ['$currentName.officialName', null] },
      otherNames: { $ifNull: ['$currentName.otherNames', null] },
      shortName: { $ifNull: ['$currentName.shortName', null] },
      structureStatus: { $ifNull: ['$structureStatus', ''] },
    },
  },
];
