import MongoRepository from '../commons/repositories/mongo.repository';
import metas from '../commons/pipelines/metas';

const lightFields = {
  nature: 1,
  type: 1,
  documentNumber: 1,
  title: 1,
  pageUrl: 1,
};
const fields = {
  ...lightFields,
  signatureDate: { $ifNull: ['$signatureDate', null] },
  startDate: { $ifNull: ['$startDate', null] },
  previsionalEndDate: { $ifNull: ['$previsionalEndDate', null] },
  endDate: { $ifNull: ['$endDate', null] },
  textExtract: { $ifNull: ['$textExtract', null] },
  comment: { $ifNull: ['$comment', null] },
};

const readModel = [
  ...metas, { $project: { _id: 0, id: 1, createdBy: 1, updatedBy: 1, createdAt: 1, updatedAt: 1, ...fields } },
];
const writeModel = [{ $project: { _id: 0, ...fields } }];
const lightModel = [{ $project: { _id: 0, id: 1, ...lightFields } }];
const checkModel = [{ $project: { _id: 0, id: 1 } }];

export default new MongoRepository({
  collection: 'official-documents',
  models: { readModel, writeModel, lightModel, checkModel },
});
