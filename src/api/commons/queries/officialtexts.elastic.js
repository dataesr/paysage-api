export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        id: 1,
        title: 1,
      }],
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $ifNull: ['$title', null] },
    },
  },
];
