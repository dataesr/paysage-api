export default [
  {
    $project: {
      _id: 0,
      id: 1,
      firstName: 1,
      lastName: 1,
      avatar: { $ifNull: ['$avatar', null] },
    },
  },
];
