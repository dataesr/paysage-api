export default [
  {
    $project: {
      _id: 0,
      id: 1,
      email: { $ifNull: ['$email', null] },
      firstName: { $ifNull: ['$firstName', null] },
      isDeleted: { $ifNull: ['$isDeleted', false] },
      lastName: { $ifNull: ['$lastName', null] },
      name: { $concat: [{ $ifNull: ['$firstName', null] }, ' ', { $ifNull: ['$lastName', null] }] },
    },
  },
];
