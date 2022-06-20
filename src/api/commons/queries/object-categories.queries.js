import metas from './metas';

const model = {
  startDate: { $ifNull: ['$startDate', null] },
  endDate: { $ifNull: ['$endDate', null] },
};

const readQuery = [
  ...metas,
  {
    $lookup: {
      from: 'categories',
      let: { categoryId: '$categoryId' },
      pipeline: [
        { $match: { $expr: { $and: [{ $ne: ['$deleted', true] }, { $eq: ['$id', '$$categoryId'] }] } } },
        { $project: {
          _id: 0,
          id: 1,
          usualNameFr: 1,
          usualNameEn: { $ifNull: ['$usualNameEn', null] },
          descriptionFr: { $ifNull: ['$descriptionFr', null] },
          descriptionEn: { $ifNull: ['$descriptionEn', null] },
        } },
      ],
      as: 'category',
    },
  },
  { $set: { category: { $arrayElemAt: ['$category', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      rid: 1,
      ...model,
      category: 1,
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
