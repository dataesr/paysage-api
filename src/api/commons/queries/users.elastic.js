export default [
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        firstName: '$firstName',
        lastName: '$lastName',
        email: '$email',
      }],
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $concat: [{ $ifNull: ['$firstName', null] }, ' ', { $ifNull: ['$lastName', null] }] },
    },
  },
];
