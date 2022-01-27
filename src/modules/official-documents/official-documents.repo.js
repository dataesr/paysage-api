import metasPipeline from '../commons/pipelines/metas';
import BaseRepo from '../commons/repositories/base.repo';

class OfficialDocumentsRepository extends BaseRepo {}

export default new OfficialDocumentsRepository({
  collection: 'official-documents',
  pipeline: [
    ...metasPipeline,
    { $project: { _id: 0 } },
  ],
});
