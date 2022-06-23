export default [
  {
    $project: {
      _id: 0,
      id: 1,
      usualNameFr: 1,
      usualNameEn: { $ifNull: ['$usualNameEn', null] },
      descriptionFr: { $ifNull: ['$descriptionFr', null] },
      descriptionEn: { $ifNull: ['$descriptionEn', null] },
      priority: 1,
    },
  },
];
