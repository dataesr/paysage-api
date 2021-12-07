import NestedRepo from '../../commons/repositories/nested.repo';

class NamesRepository extends NestedRepo {}

export default new NamesRepository({ collection: 'structures', field: 'names' });
