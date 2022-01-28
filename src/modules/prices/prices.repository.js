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
  { $project: { parentIds: 0, 'parents._id': 0 } },
  { $project: {
    _id: 0,
    parents: {
      nameFr: 1,
      nameEn: 1,
      id: 1,
    },
    id: 1,
    createdBy: 1,
    updatedBy: 1,
    createdAt: 1,
    updatedAt: 1,
    nameFr: { $ifNull: ['$nameFr', null] },
    nameEn: { $ifNull: ['$nameEn', null] },
    descriptionFr: { $ifNull: ['$descriptionFr', null] },
    descriptionEn: { $ifNull: ['$descriptionEn', null] },
    startDate: { $ifNull: ['$startDate', null] },
    endDate: { $ifNull: ['$endDate', null] },
  } },
];
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
const lightModel = [{
  $project: {
    _id: 0,
    id: 1,
    nameFr: 1,
    nameEn: 1,
  },
}];
const checkModel = [{
  $project: {
    _id: 0,
    id: 1,
  },
}];

export default new MongoRepository({
  collection: 'prices',
  models: { readModel, writeModel, lightModel, checkModel },
});
