import metas from '../../commons/pipelines/metas';

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
      rid: 1,
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
