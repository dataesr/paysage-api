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
  { $set: { person: { $arrayElemAt: ['$person', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      ...model,
      person: {
        id: 1,
        firstName: 1,
        lastName: 1,
      },
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];
const writeQuery = [{ $project: { _id: 0, id: 1, categoryId: 1, ...model } }];

export default { readQuery, writeQuery };
