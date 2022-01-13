import BaseRepo from '../commons/repositories/base.repo';
import NestedRepo from '../commons/repositories/nested.repo';

const commonPipeline = [
  {
    $lookup: {
      from: 'users',
      localField: 'createdBy',
      foreignField: 'id',
      as: 'user',
    },
  },
  { $set: { user: { $arrayElemAt: ['$user', 0] } } },
  { $set: { createdBy: { id: '$user.id', username: '$user.username', avatar: '$user.avatar' } } },
  {
    $lookup: {
      from: 'users',
      localField: 'updatedBy',
      foreignField: 'id',
      as: 'user',
    },
  },
  { $set: { user: { $arrayElemAt: ['$user', 0] } } },
  { $set: { updatedBy: { id: '$user.id', username: '$user.username', avatar: '$user.avatar' } } },
];

class StructuresRepository extends BaseRepo {
  async getStatus(id) {
    return this._collection.findOne({ id }, { projection: { _id: 0, __status: 1 } });
  }

  async getRowModel(id, { session = null } = {}) {
    return this._collection.findOne({ id }, { projection: { _id: 0, id: 1, status: 1 } }, { session });
  }

  async redirect(id, to, { session = null } = {}) {
    return this._collection.updateOne({ id }, { $set: { __status: 'redirected', __target: to } }, { session });
  }

  get names() {
    return new NestedRepo({
      collection: this._collectionName,
      field: 'names',
      pipeline: [...commonPipeline, { $project: { _id: 0 } }],
    });
  }

  get indetifiers() {
    return new NestedRepo({
      collection: this._collectionName,
      field: 'identifiers',
      pipeline: [...commonPipeline, { $project: { _id: 0 } }],
    });
  }
}

export default new StructuresRepository({
  collection: 'structures',
  pipeline: [
    ...commonPipeline,
    { $project: {
      _id: 0,
      id: 1,
      status: { $ifNull: ['$status', 'null'] },
      createdBy: 1,
      updatedBy: 1,
      updatedAt: 1,
      createdAt: 1,
    } },
  ],
});
