import metas from '../commons/pipelines/metas';

const model = {
  lastName: 1,
  firstName: { $ifNull: ['$firstName', null] },
  otherNames: { $ifNull: ['$otherNames', []] },
  gender: { $ifNull: ['$gender', null] },
  birthDate: { $ifNull: ['$birthDate', null] },
  deathDate: { $ifNull: ['$deathDate', null] },
  activity: { $ifNull: ['$activity', null] },
  comment: { $ifNull: ['$comment', null] },
};
const readQuery = [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      ...model,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];
const writeQuery = [{ $project: { _id: 0, ...model } }];
const checkQuery = [{ $project: { _id: 0, id: 1 } }];

export default { readQuery, writeQuery, checkQuery };
