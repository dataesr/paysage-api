import metasPipeline from '../commons/pipelines/metas';
import BaseRepo from '../commons/repositories/base.repo';

class LegalCategoriesRepository extends BaseRepo { }

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

export default new LegalCategoriesRepository({
  collection: 'legal-categories',
  pipeline: [
    ...metasPipeline,
    ...officialDocumentPipeline,
    { $project: { _id: 0, officialDocumentId: 0 } },
  ],
});
