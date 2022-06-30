export default [
  {
    $project: {
      _id: 0,
      id: 1,
      usualName: 1,
      otherNames: { $ifNull: ['$otherNames', []] },
    },
  },
];
