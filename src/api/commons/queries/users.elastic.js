export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        email: '$email',
        firstName: '$firstName',
        lastName: '$lastName',
      }],
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $concat: [{ $ifNull: ['$firstName', null] }, ' ', { $ifNull: ['$lastName', null] }] },
    },
  },
];
