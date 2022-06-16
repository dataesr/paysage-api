import metas from '../pipelines/metas';

const model = {
  type: 1,
  url: 1,
  language: { $ifNull: ['$language', null] },
  resourceId: 1,
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

export { readQuery };
