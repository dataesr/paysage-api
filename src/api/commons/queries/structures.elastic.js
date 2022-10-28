import currentNameQuery from './current-name.query';

export default [
  ...currentNameQuery,
  {
    $set: {
      toindex: {
        $concatArrays: ['$names', { $ifNull: ['$localisations', []] }],
      },
    },
  },
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: {
        acronymEn: { $ifNull: ['$currentName.acronymEn', null] },
        acronymFr: { $ifNull: ['$currentName.acronymFr', null] },
        acronymLocal: { $ifNull: ['$currentName.acronymLocal', null] },
        brandName: { $ifNull: ['$currentName.brandName', null] },
        locality: { $ifNull: ['$localisations.locality', null] },
        nameEn: { $ifNull: ['$currentName.nameEn', null] },
        officialName: { $ifNull: ['$currentName.officialName', null] },
        otherNames: { $ifNull: ['$currentName.otherNames', null] },
        shortName: { $ifNull: ['$currentName.shortName', null] },
        usualName: { $ifNull: ['$currentName.usualName', null] },
      },
      acronym: { $ifNull: ['$currentName.acronymFr', null] },
      creationDate: { $ifNull: ['$creationDate', null] },
      isDeleted: { $ifNull: ['$isDeleted', false] },
      locality: { $ifNull: ['$localisations.locality', null] },
      name: { $ifNull: ['$currentName.usualName', null] },
    },
  },
];
