import BaseRepo from '../../commons/repositories/base.repo';

class OfficialDocumentsRepository extends BaseRepo {}

export default new OfficialDocumentsRepository({ collection: 'officialDocuments' });
