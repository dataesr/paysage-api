import metas from '../pipelines/metas';

const model = {
  account: 1,
  type: 1,
};

const readQuery = [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      resourceId: 1,
      ...model,
      createdAt: 1,
      createdBy: 1,
      updatedAt: 1,
      updatedBy: 1,
    },
  },
];

const writeQuery = [{ $project: { _id: 0, id: 1, ...model } }];

export {
  readQuery,
  writeQuery,
};
