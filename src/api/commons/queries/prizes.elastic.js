export default [
  {
    $project: {
      _id: 0,
      id: 1,
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $ifNull: ['$nameFr', null] },
      nameEn: { $ifNull: ['$nameEn', null] },
      nameFr: { $ifNull: ['$nameFr', null] },
    },
  },
];
