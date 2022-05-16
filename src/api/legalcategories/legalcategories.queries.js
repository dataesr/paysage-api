import metas from '../commons/pipelines/metas';

const model = {
  longNameFr: 1,
  inseeCode: { $ifNull: ['$inseeCode', null] },
  shortNameFr: { $ifNull: ['$shortNameFr', null] },
  acronymeFr: { $ifNull: ['$acronymeFr', null] },
  pluralNameFr: { $ifNull: ['$pluralNameFr', null] },
  descriptionFr: { $ifNull: ['$descriptionFr', null] },
  longNameEn: { $ifNull: ['$longNameEn', null] },
  shortNameEn: { $ifNull: ['$shortNameEn', null] },
  otherNames: { $ifNull: ['$otherNames', []] },
  sector: { $ifNull: ['$sector', null] },
  legalPersonality: { $ifNull: ['$legalPersonality', null] },
  inPublicResearch: { $ifNull: ['$inPublicResearch', null] },
  wikidataId: { $ifNull: ['$wikidataId', null] },
  websiteFr: { $ifNull: ['$websiteFr', null] },
  websiteEn: { $ifNull: ['$websiteEn', null] },
  comment: { $ifNull: ['$comment', null] },
};

const readQuery = [
  ...metas,
  {
    $lookup: {
      from: 'official-documents',
      localField: 'officialDocumentId',
      foreignField: 'id',
      as: 'officialDocument',
    },
  },
  { $set: { officialDocument: { $arrayElemAt: ['$officialDocument', 0] } } },
  { $project: { officialDocument: { _id: 0, createdAt: 0, createdBy: 0, updatedAt: 0, updatedBy: 0 } } },
  { $project: {
    _id: 0,
    id: 1,
    createdBy: 1,
    updatedBy: 1,
    createdAt: 1,
    updatedAt: 1,
    ...model,
    officialDocument: 1,
  } },
];

const writeQuery = [{
  $project: {
    _id: 0,
    id: 1,
    ...model,
    officialDocumentId: { $ifNull: ['$officialDocumentId', [null]] },
  },
}];

export {
  readQuery,
  writeQuery,
};
