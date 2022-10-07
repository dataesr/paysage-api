export default [
  {
    $project: {
      _id: 0,
      id: 1,
      displayName: '$usualNameFr',
      collection: 'categories',
      href: { $concat: ['/categories/', '$id'] },
      usualNameFr: 1,
      usualNameEn: { $ifNull: ['$usualNameEn', null] },
      descriptionFr: { $ifNull: ['$descriptionFr', null] },
      descriptionEn: { $ifNull: ['$descriptionEn', null] },
      priority: 1,
    },
  },
];
