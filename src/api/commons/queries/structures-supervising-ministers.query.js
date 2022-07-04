import metas from './metas.query';
import supervisingMinisterLightQuery from './supervising-ministers.light.query';

export default [
  ...metas,
  {
    $lookup: {
      from: 'supervisingministers',
      localField: 'supervisingMinisterId',
      foreignField: 'id',
      pipeline: supervisingMinisterLightQuery,
      as: 'supervisingMinister',
    },
  },
  { $set: { supervisingMinister: { $arrayElemAt: ['$supervisingMinister', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      endDate: { $ifNull: ['$endDate', null] },
      startDate: { $ifNull: ['$startDate', null] },
      supervisingMinister: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];
