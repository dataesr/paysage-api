import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      name: 1,
      acronym: { $ifNull: ['$acronym', null] },
      maleName: { $ifNull: ['$maleName', null] },
      pluralName: { $ifNull: ['$pluralName', null] },
      feminineName: { $ifNull: ['$feminineName', null] },
      otherNames: { $ifNull: ['$otherNames', []] },
      for: 1,
      mandateTypeGroup: { $ifNull: ['$mandateTypeGroup', 'Autres fonctions'] },
      priority: { $ifNull: ['$priority', 99] },
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];
