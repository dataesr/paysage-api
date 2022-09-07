export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        firstName: '$firstName',
        lastName: '$lastName',
      }],
      name: { $concat: [{ $ifNull: ['$firstName', null] }, ' ', { $ifNull: ['$lastName', null] }] },
    },
  },
];
