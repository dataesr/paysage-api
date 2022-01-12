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

export default new StructuresRepository({
  collection: 'structures',
  pipeline: [
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
    { $project: {
      _id: 0,
      id: 1,
      status: 1,
      createdBy: 1,
      updatedBy: 1,
      updatedAt: 1,
      createdAt: 1,
    } },
  ],
});
