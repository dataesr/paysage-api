export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        email: { $ifNull: ['$email', null] },
        firstName: { $ifNull: ['$firstName', null] },
        lastName: { $ifNull: ['$lastName', null] },
      }],
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $concat: [{ $ifNull: ['$firstName', null] }, ' ', { $ifNull: ['$lastName', null] }] },
    },
  },
];
