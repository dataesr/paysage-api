import BaseRepo from '../commons/repositories/base.repo';
import NestedRepo from '../commons/repositories/nested.repo';

const currentNamePipeline = [];
const alternativePaysageIdPipeline = [];

class StructuresRepository extends BaseRepo {
  async getStatus(id) {
    const state = await this._collection.findOne({ id }, { projection: { status: 1, redirection: 1 } });
    return state || {};
  }

  async getRowModel(id, { session = null } = {}) {
    return this._collection.findOne(
      { id },
      { projection: { _id: 0, structureStatus: 1 }, session },
    );
  }

  get names() {
    return new NestedRepo({
      collection: this._collectionName,
      field: 'names',
      pipeline: [{ $project: { _id: 0, createdAt: 0, updatedAt: 0 } }],
    });
  }

  get indetifiers() {
    return new NestedRepo({
      collection: this._collectionName,
      field: 'identifiers',
      pipeline: [{ $project: { _id: 0, createdAt: 0, updatedAt: 0 } }],
    });
  }
}

export default new StructuresRepository({
  collection: 'structures',
  pipeline: [
    ...currentNamePipeline,
    ...alternativePaysageIdPipeline,
    { $project: {
      _id: 0,
      id: 1,
      structureStatus: { $ifNull: ['$structureStatus', 'null'] },
      status: 1,
      alternativePaysageIds: { $ifNull: ['$alternativePaysageIds', []] },
      redirection: 1,
      expiresAt: 1,
    } },
  ],
});
