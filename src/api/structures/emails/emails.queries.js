import metas from '../../commons/pipelines/metas';

const model = {
  type: 1,
  email: 1,
};

const readQuery = [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      resourceId: 1,
      ...model,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];

export {
  readQuery,
};
