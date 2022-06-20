import metas from './metas';

const model = {
  startDate: { $ifNull: ['$startDate', null] },
  endDate: { $ifNull: ['$endDate', null] },
};

const readQuery = [
  ...metas,
  {
    $lookup: {
      from: 'legalcategories',
      let: { legalcategoryId: '$legalcategoryId' },
      pipeline: [
        { $match: { $expr: { $and: [{ $ne: ['$deleted', true] }, { $eq: ['$id', '$$legalcategoryId'] }] } } },
        { $project: {
          _id: 0,
          id: 1,
          longNameFr: 1,
          longNameEn: { $ifNull: ['$longNameEn', null] },
          descriptionFr: { $ifNull: ['$descriptionFr', null] },
          descriptionEn: { $ifNull: ['$descriptionEn', null] },
        } },
      ],
      as: 'legalcategory',
    },
  },
  { $set: { legalcategory: { $arrayElemAt: ['$legalcategory', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      resourceId: 1,
      ...model,
      legalcategory: 1,
      legalcategoryId: 1,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];

const writeQuery = [{ $project: { _id: 0, id: 1, legalcategoryId: 1, ...model } }];

export {
  readQuery,
  writeQuery,
};
