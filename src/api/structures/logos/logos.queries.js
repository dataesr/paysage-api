import metas from '../../commons/pipelines/metas';

const model = {
  legend: { $ifNull: ['$legend', null] },
  credits: { $ifNull: ['$credits', null] },
  license: { $ifNull: ['$license', null] },
  startDate: { $ifNull: ['$startDate', null] },
  endDate: { $ifNull: ['$endDate', null] },
  comment: { $ifNull: ['$comment', null] },
  url: 1,
  mimetype: 1,
  originalName: 1,
  path: 1,
};

const readQuery = [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
      ...model,
    },
  },
];
const writeQuery = [{ $project: { _id: 0, id: 1, ...model } }];

export default { readQuery, writeQuery };
