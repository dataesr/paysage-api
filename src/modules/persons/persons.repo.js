import metasPipeline from '../commons/pipelines/metas';
import BaseRepo from '../commons/repositories/base.repo';

class PersonsRepository extends BaseRepo { }

export default new PersonsRepository({
  collection: 'persons',
  pipeline: [
    ...metasPipeline,
    { $project: { _id: 0 } },
  ],
});
