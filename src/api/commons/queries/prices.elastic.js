export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        nameFr: '$nameFr',
        nameEn: '$nameEn',
      }],
      name: { $ifNull: ['$nameFr', null] },
    },
  },
];
