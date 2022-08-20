import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      name: 1,
      acronym: { $ifNull: ['$acronym', null] },
      otherNames: { $ifNull: ['$otherNames', []] },
      description: { $ifNull: ['$description', null] },
    },
  },
];
