export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        firstName: { $ifNull: ['$firstName', false] },
        lastName: { $ifNull: ['$lastName', false] },
        otherNames: { $ifNull: ['$otherNames', false] },
      }],
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $concat: [{ $ifNull: ['$firstName', null] }, ' ', '$lastName'] },
    },
  },
];
