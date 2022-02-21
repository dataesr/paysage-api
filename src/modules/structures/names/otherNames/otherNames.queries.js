import metas from '../../../commons/pipelines/metas';

const fields = {
  otherNames: { $ifNull: ['$otherNames', []] },
};

const readQuery = [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      rid: 1,
      ...fields,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];
const writeQuery = [{ $project: { _id: 0, id: 1, ...fields } }];

export default { readQuery, writeQuery };
