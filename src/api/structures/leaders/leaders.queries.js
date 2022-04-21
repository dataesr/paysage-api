import metas from '../../commons/pipelines/metas';

const model = {
  startDate: { $ifNull: ['$startDate', null] },
  endDate: { $ifNull: ['$endDate', null] },
};

const readQuery = [
  ...metas,
  {
    $lookup: {
      from: 'persons',
      localField: 'personId',
      foreignField: 'id',
      as: 'person',
    },
  },
  {
    $lookup: {
      from: 'roles',
      localField: 'roleId',
      foreignField: 'id',
      as: 'role',
    },
  },
  { $set: { person: { $arrayElemAt: ['$person', 0] } } },
  { $set: { role: { $arrayElemAt: ['$role', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      ...model,
      person: personLightModel,
      role: roleLightModel,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];
const writeQuery = [{ $project: { _id: 0, id: 1, personId: 1, roleId: 1, ...model } }];

export default { readQuery, writeQuery };
