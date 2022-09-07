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
        officialName: 1,
        usualName: 1,
        shortName: 1,
        brandName: 1,
        nameEn: 1,
        acronymFr: 1,
        acronymEn: 1,
        acronymLocal: 1,
        otherNames: 1,
        locality: 1,
      },
      name: { $ifNull: ['$currentName.usualName', null] },
      acronym: { $ifNull: ['$currentName.acronymFr', null] },
    },
  },
];
