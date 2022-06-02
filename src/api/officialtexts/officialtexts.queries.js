import metas from '../commons/pipelines/metas';

const lightModel = {
  nature: 1,
  type: 1,
  textNumber: 1,
  title: 1,
  pageUrl: 1,
};

const model = {
  ...lightModel,
  signatureDate: { $ifNull: ['$signatureDate', null] },
  startDate: { $ifNull: ['$startDate', null] },
  previsionalEndDate: { $ifNull: ['$previsionalEndDate', null] },
  endDate: { $ifNull: ['$endDate', null] },
  textExtract: { $ifNull: ['$textExtract', null] },
  comment: { $ifNull: ['$comment', null] },
};

const readQuery = [
  ...metas, { $project: { _id: 0, id: 1, createdBy: 1, updatedBy: 1, createdAt: 1, updatedAt: 1, ...model } },
];

const writeQuery = [{ $project: { _id: 0, ...model } }];

const checkQuery = [{ $project: { _id: 0, id: 1 } }];

export {
  checkQuery,
  readQuery,
  writeQuery,
};
