import metas from '../../commons/pipelines/metas';

const model = {
  type: 1,
  url: 1,
  language: { $ifNull: ['$language', null] },
};

const readQuery = [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      ...model,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];

const writeQuery = [{ $project: { _id: 0, id: 1, ...model } }];

export {
  readQuery,
  writeQuery,
};
