export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        firstName: 1,
        lastName: 1,
        otherNames: 1,
      }],
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $concat: [{ $ifNull: ['$firstName', null] }, ' ', '$lastName'] },
    },
  },
];
