export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        nameEn: { $ifNull: ['$nameEn', false] },
        nameFr: { $ifNull: ['$nameFr', false] },
      }],
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $ifNull: ['$nameFr', null] },
    },
  },
];
