import metas from '../../commons/pipelines/metas';

const currentNamePipeline = [
  {
    $set: {
      currentName: {
        $filter: {
          input: '$names',
          as: 'name',
          cond: { $eq: ['$$name.id', '$currentNameId'] },
        },
      },
    },
  },
  { $set: { currentName: { $arrayElemAt: ['$currentName', 0] } } },
];
const readQuery = [
  ...metas,
  ...currentNamePipeline,
  {
    $project: {
      _id: 0,
      id: 1,
      structureStatus: { $ifNull: ['$structureStatus', null] },
      status: 1,
      alternativePaysageIds: { $ifNull: ['$alternativePaysageIds', []] },
      currentName: { $ifNull: ['$currentName', {}] },
      redirection: { $ifNull: ['$redirection', null] },
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];
const writeQuery = [{ $project: { _id: 0, id: 1, status: 1, redirection: { $ifNull: ['$redirection', null] } } }];

export default { readQuery, writeQuery };
