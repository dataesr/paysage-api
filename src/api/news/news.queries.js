import metas from '../commons/pipelines/metas';

const model = {
  title: 1,
  articleNumber: { $ifNull: ['$articleNumber', null] },
  summary: { $ifNull: ['$summary', null] },
  text: { $ifNull: ['$text', null] },
  date: { $ifNull: ['$date', null] },
  sourceUrl: { $ifNull: ['$sourceUrl', null] },
  sourceType: { $ifNull: ['$sourceType', null] },
};

const readQuery = [
  ...metas,
  { $project: {
    _id: 0,
    id: 1,
    createdBy: 1,
    updatedBy: 1,
    createdAt: 1,
    updatedAt: 1,
    ...model,
  } },
];
const writeQuery = [{ $project: { _id: 0, id: 1, ...model } }];

export default { readQuery, writeQuery };
