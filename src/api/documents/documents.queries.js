import metas from '../commons/pipelines/metas';

const model = {
  title: 1,
  description: { $ifNull: ['$description', null] },
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
