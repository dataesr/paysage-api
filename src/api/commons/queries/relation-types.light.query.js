export default [
  {
    $project: {
      _id: 0,
      id: 1,
      name: 1,
      acronym: { $ifNull: ['$acronym', null] },
      pluralName: { $ifNull: ['$pluralName', null] },
      maleName: { $ifNull: ['$maleName', null] },
      feminineName: { $ifNull: ['$feminineName', null] },
      priority: { $ifNull: ['$priority', 99] },
    },
  },
];
