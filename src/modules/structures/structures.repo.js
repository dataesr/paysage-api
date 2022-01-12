import BaseRepo from '../commons/repositories/base.repo';
import NestedRepo from '../commons/repositories/nested.repo';

class StructuresRepository extends BaseRepo {
  async getStatus(id) {
    return this._collection.findOne({ id }, { projection: { _id: 0, __status: 1 } });
  }

  get names() {
    return NestedRepo({ collection: this._collection, field: 'names', pipeline: [] });
  }

  get indetifiers() {
    return NestedRepo({ collection: this._collection, field: 'identifiers', pipeline: [] });
  }
}

export default new StructuresRepository({ collection: 'structures', pipeline: [] });
