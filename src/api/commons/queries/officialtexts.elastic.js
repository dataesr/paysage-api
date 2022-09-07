export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        title: '$title',
      }],
      name: { $ifNull: ['$title', null] },
    },
  },
];
