import NestedRepo from '../../commons/repositories/nested.repo';

class IdentifiersRepository extends NestedRepo {}

export default new IdentifiersRepository({ collection: 'structures', field: 'identifiers' });
