import metasPipeline from '../commons/pipelines/metas';
import BaseRepo from '../commons/repositories/base.repo';

const officialDocumentPipeline = [
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
];

const parentCategoriesPipeline = [
  {
    $lookup: {
      from: 'categories',
      localField: 'parentIds',
      foreignField: 'id',
      as: 'parents',
    },
  },
  { $project: { parents: { _id: 0, createdAt: 0, createdBy: 0, updatedAt: 0, updatedBy: 0, officialDocumentId: 0 } } },
];

class CategoriesRepository extends BaseRepo { }

export default new CategoriesRepository({
  collection: 'categories',
  pipeline: [
    ...metasPipeline,
    ...officialDocumentPipeline,
    ...parentCategoriesPipeline,
    { $project: { _id: 0, officialDocumentId: 0, parentIds: 0 } },
  ],
});
