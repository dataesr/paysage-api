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
const writeQuery = [{ $project: { _id: 0, id: 1, structureStatus: 1, currentNameId: 1 } }];
const lightQuery = [...currentNamePipeline, { $project: { _id: 0, id: 1, structureStatus: 1, currentName: 1 } }];
const checkQuery = [{ $project: { _id: 0, id: 1 } }];

export default {
  readQuery,
  writeQuery,
  lightQuery,
  checkQuery,
};
