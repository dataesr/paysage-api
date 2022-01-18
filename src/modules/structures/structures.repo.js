import BaseRepo from '../commons/repositories/base.repo';
import NestedRepo from '../commons/repositories/nested.repo';

const currentNamePipeline = [];
const alternativePaysageIdPipeline = [];
const metasPipeline = [
  {
    $lookup: {
      from: 'users',
      localField: 'createdBy',
      foreignField: 'id',
      as: 'user',
    },
  },
  { $set: { user: { $arrayElemAt: ['$user', 0] } } },
  { $set: { createdBy: { id: '$user.id', username: '$user.username', avatar: { $ifNull: ['$user.avatar', null] } } } },
  {
    $lookup: {
      from: 'users',
      localField: 'updatedBy',
      foreignField: 'id',
      as: 'user',
    },
  },
  { $set: { user: { $arrayElemAt: ['$user', 0] } } },
  { $set: { updatedBy: { id: '$user.id', username: '$user.username', avatar: { $ifNull: ['$user.avatar', null] } } } },
  { $project: { user: 0 } },
];

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
      pipeline: [...metasPipeline, { $project: { _id: 0 } }],
    });
  }

  get indetifiers() {
    return new NestedRepo({
      collection: this._collectionName,
      field: 'identifiers',
      pipeline: [...metasPipeline, { $project: { _id: 0 } }],
    });
  }
}

export default new StructuresRepository({
  collection: 'structures',
  pipeline: [
    ...currentNamePipeline,
    ...alternativePaysageIdPipeline,
    ...metasPipeline,
    { $project: {
      _id: 0,
      id: 1,
      structureStatus: { $ifNull: ['$structureStatus', 'null'] },
      status: 1,
      alternativePaysageIds: { $ifNull: ['$alternativePaysageIds', []] },
      currentName: { $ifNull: ['$currentName', {}] },
      redirection: 1,
      expiresAt: 1,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: { $ifNull: ['$updatedAt', null] },
    } },
  ],
});
