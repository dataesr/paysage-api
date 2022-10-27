export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        id: 1,
        nameEn: 1,
        nameFr: 1,
      }],
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $ifNull: ['$nameFr', null] },
    },
  },
];
