import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      lastName: 1,
      firstName: { $ifNull: ['$firstName', null] },
      otherNames: { $ifNull: ['$otherNames', []] },
      gender: { $ifNull: ['$gender', null] },
      birthDate: { $ifNull: ['$birthDate', null] },
      deathDate: { $ifNull: ['$deathDate', null] },
      activity: { $ifNull: ['$activity', null] },
      comment: { $ifNull: ['$comment', null] },
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];
