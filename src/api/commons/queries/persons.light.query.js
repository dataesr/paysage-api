export default [
  {
    $project: {
      _id: 0,
      id: 1,
      lastName: 1,
      firstName: { $ifNull: ['$firstName', null] },
      gender: { $ifNull: ['$gender', null] },
      birthDate: { $ifNull: ['$birthDate', null] },
      deathDate: { $ifNull: ['$deathDate', null] },
      activity: { $ifNull: ['$activity', null] },
    },
  },
];
