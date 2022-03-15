import metas from '../../commons/pipelines/metas';

const model = {
  usualNameFr: 1,
  usualNameEn: { $ifNull: ['$usualNameEn', null] },
  shortNameEn: { $ifNull: ['$shortNameEn', null] },
  shortNameFr: { $ifNull: ['$shortNameFr', null] },
  acronymFr: { $ifNull: ['$acronymFr', null] },
  pluralNameFr: { $ifNull: ['$pluralNameFr', null] },
  otherNamesFr: { $ifNull: ['$otherNamesFr', []] },
  otherNamesEn: { $ifNull: ['$otherNamesEn', []] },
  descriptionFr: { $ifNull: ['$descriptionFr', null] },
  descriptionEn: { $ifNull: ['$descriptionEn', null] },
  inseeCode: { $ifNull: ['$inseeCode', null] },
  sector: { $ifNull: ['$sector', null] },
  inPublicResearch: { $ifNull: ['$inPublicResearch', null] },
  comment: { $ifNull: ['$comment', null] },
  isLegalCategory: { $ifNull: ['$isLegalCategory', null] },
};

const lightModel = {
  id: 1,
  usualNameFr: 1,
  usualNameEn: { $ifNull: ['$usualNameEn', null] },
  descriptionFr: { $ifNull: ['$descriptionFr', null] },
  descriptionEn: { $ifNull: ['$descriptionEn', null] },
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
  {
    $lookup: {
      from: 'categories',
      localField: 'parentIds',
      foreignField: 'id',
      as: 'parents',
    },
  },
  {
    $lookup: {
      from: 'categories',
      localField: 'id',
      foreignField: 'parentIds',
      as: 'childs',
    },
  },
  { $project: {
    _id: 0,
    id: 1,
    createdBy: 1,
    updatedBy: 1,
    createdAt: 1,
    updatedAt: 1,
    ...model,
    officialDocument: 1,
    parents: lightModel,
    childs: lightModel,
  } },
];
const writeQuery = [{
  $project: {
    _id: 0,
    id: 1,
    ...model,
    officialDocumentId: { $ifNull: ['$officialDocumentId', null] },
    parentsIds: { $ifNull: ['$parentIds', []] },
  },
}];
const checkQuery = [{ $project: { _id: 0, id: 1 } }];

const indexQuery = [{
  $project: {
    _id: 0,
    id: 1,
    type: 'categories',
    usualNameFr: 1,
    usualNameEn: { $ifNull: ['$usualNameEn', null] },
    shortNameEn: { $ifNull: ['$shortNameEn', null] },
    shortNameFr: { $ifNull: ['$shortNameFr', null] },
    acronymFr: { $ifNull: ['$acronymFr', null] },
    pluralNameFr: { $ifNull: ['$pluralNameFr', null] },
    otherNamesFr: { $ifNull: ['$otherNamesFr', []] },
    otherNamesEn: { $ifNull: ['$otherNamesEn', []] },
    suggest: ['$usualNameFr', '$usualNameEn', '$shortNameEn', '$shortNameFr', '$acronymFr', '$pluralNameFr'],
  },
},
{ $set: {
  suggest: {
    $filter: {
      input: { $concatArrays: ['$suggest', '$otherNamesFr', '$otherNamesEn'] },
      as: 'item',
      cond: { $gt: ['$$item', null] },
    },
  },
} }];

export default { readQuery, writeQuery, checkQuery, indexQuery };
