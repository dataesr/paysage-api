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
      let: { personId: '$personId' },
      pipeline: [
        { $match: { $expr: { $and: [{ $ne: ['$deleted', true] }, { $eq: ['$id', '$$categoryId'] }] } } },
        { $project: {
          _id: 0,
          id: 1,
          lastName: 1,
          firstName: { $ifNull: ['$firstName', null] },
        } },
      ],
      as: 'person',
    },
  },
  { $set: { category: { $arrayElemAt: ['$person', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      rid: 1,
      ...model,
      person: 1,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];

const writeQuery = [{ $project: { _id: 0, id: 1, categoryId: 1, ...model } }];

export {
  readQuery,
  writeQuery,
};
