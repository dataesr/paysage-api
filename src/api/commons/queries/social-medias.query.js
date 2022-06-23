import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      account: 1,
      type: 1,
      resourceId: 1,
      createdAt: 1,
      createdBy: 1,
      updatedAt: 1,
      updatedBy: 1,
    },
  },
];
