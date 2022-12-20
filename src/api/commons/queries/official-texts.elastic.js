export default [
  {
    $project: {
      _id: 0,
      id: 1,
      isDeleted: { $ifNull: ['$isDeleted', false] },
      publicationDate: { $ifNull: ['$publicationDate', ''] },
      name: { $ifNull: ['$title', ''] },
      title: { $ifNull: ['$title', ''] },
    },
  },
];
