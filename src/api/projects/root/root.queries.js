import metas from '../../commons/pipelines/metas';

const model = {
  _id: 0,
  id: 1,
  nameFr: 1,
  nameEn: { $ifNull: ['$nameEn', null] },
  fullNameFr: { $ifNull: ['$fullNameFr', null] },
  fullNameEn: { $ifNull: ['$fullNameEn', null] },
  acronymFr: { $ifNull: ['$acronymFr', null] },
  acronymEn: { $ifNull: ['$acronymEn', null] },
  description: { $ifNull: ['$description', null] },
  startDate: { $ifNull: ['$startDate', null] },
  endDate: { $ifNull: ['$endDate', null] },
  grantPart: { $ifNull: ['$grantPart', null] },
  comment: { $ifNull: ['$comment', null] },
  createdBy: 1,
  updatedBy: 1,
  createdAt: 1,
  updatedAt: 1,
};

const readQuery = [...metas, { $project: { ...model } }];

export { readQuery };
