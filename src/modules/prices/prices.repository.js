import MongoRepository from '../commons/repositories/mongo.repository';
import metas from '../commons/pipelines/metas';

const readModel = [
  ...metas,
  {
    $lookup: {
      from: 'prices',
      localField: 'parentIds',
      foreignField: 'id',
      as: 'parents',
    },
  },
  { $project: {
    _id: 0,
    parentIds: 0,
    parents: {
      _id: 0,
      startDate: 0,
      createdBy: 0,
      updatedBy: 0,
      createdAt: 0,
      updatedAt: 0,
      endDate: 0,
      descriptionFr: 0,
      descriptionEn: 0,
    },
  } }];
const writeModel = [{
  $project: {
    _id: 0,
    nameFr: 1,
    nameEn: 1,
    descriptionFr: 1,
    descriptionEn: 1,
    parentIds: 1,
    startDate: 1,
    endDate: 1,
  },
}];
const referenceModel = [{
  $project: {
    _id: 0,
    id: 1,
    nameFr: 1,
    nameEn: 1,
  },
}];

export default new MongoRepository({ collection: 'prices', models: { readModel, writeModel, referenceModel } });
