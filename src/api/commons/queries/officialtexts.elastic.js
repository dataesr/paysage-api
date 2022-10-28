export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        title: { $ifNull: ['$title', ''] },
      }],
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $ifNull: ['$title', ''] },
    },
  },
];
