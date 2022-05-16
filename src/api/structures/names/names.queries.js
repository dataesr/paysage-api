import metas from '../../commons/pipelines/metas';

const fields = {
  officialName: 1,
  usualName: { $ifNull: ['$usualName', null] },
  shortName: { $ifNull: ['$shortName', null] },
  brandName: { $ifNull: ['$brandName', null] },
  nameEn: { $ifNull: ['$nameEn', null] },
  acronymFr: { $ifNull: ['$acronymFr', null] },
  acronymEn: { $ifNull: ['$acronymEn', null] },
  otherNames: { $ifNull: ['$otherNames', []] },
  startDate: { $ifNull: ['$startDate', null] },
  endDate: { $ifNull: ['$endDate', null] },
  comment: { $ifNull: ['$comment', null] },
  article: { $ifNull: ['$article', null] },
};

const readQuery = [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      rid: 1,
      ...fields,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];

const writeQuery = [{ $project: { _id: 0, id: 1, ...fields } }];

export {
  readQuery,
  writeQuery,
};
