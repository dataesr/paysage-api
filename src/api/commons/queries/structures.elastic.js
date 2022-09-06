export default [
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
      isDeleted: { $ifNull: ['$isDeleted', false] },
    },
  },
];
