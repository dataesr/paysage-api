import metas from '../commons/pipelines/metas';

const lightFields = {
  nameFr: { $ifNull: ['$nameFr', null] },
  nameEn: { $ifNull: ['$nameEn', null] },
};

const fields = {
  ...lightFields,
  descriptionFr: { $ifNull: ['$descriptionFr', null] },
  descriptionEn: { $ifNull: ['$descriptionEn', null] },
  startDate: { $ifNull: ['$startDate', null] },
  endDate: { $ifNull: ['$endDate', null] },
};
const readQuery = [
  ...metas,
  {
    $lookup: {
      from: 'prices',
      localField: 'parentIds',
      foreignField: 'id',
      as: 'parents',
    },
  },
  { $project: { parentIds: 0, 'parents._id': 0 } },
  {
    $project: {
      _id: 0,
      parents: {
        nameFr: 1,
        nameEn: 1,
        id: 1,
      },
      id: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
      ...fields,
    },
  },
];
const writeQuery = [{ $project: { _id: 0, parentIds: { $ifNull: ['$parentIds', []] }, ...fields } }];
const lightQuery = [{ $project: { _id: 0, id: 1, ...lightFields } }];
const checkQuery = [{ $project: { _id: 0, id: 1 } }];

export default { readQuery, writeQuery, lightQuery, checkQuery };
