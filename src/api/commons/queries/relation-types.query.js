import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      name: 1,
      acronym: { $ifNull: ['$acronym', null] },
      pluralName: { $ifNull: ['$pluralName', null] },
      feminineName: { $ifNull: ['$feminineName', null] },
      otherNames: { $ifNull: ['$otherNames', []] },
      for: 1,
      priority: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];
