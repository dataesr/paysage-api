import metas from '../../commons/pipelines/metas';

const model = {
  address: 1,
  cityFrId: { $ifNull: ['$cityFrId', null] },
  inseeId: { $ifNull: ['$inseeId', null] },
  cityForeignId: { $ifNull: ['$cityForeignId', null] },
  distributionStatement: { $ifNull: ['$distributionStatement', null] },
  postbox: { $ifNull: ['$postbox', null] },
  zipcode: { $ifNull: ['$zipcode', null] },
  city: { $ifNull: ['$city', null] },
  geometry: { $ifNull: ['$geometry', {}] },
  startDate: { $ifNull: ['$startDate', null] },
  endDate: { $ifNull: ['$endDate', null] },
};

const readQuery = [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      ...model,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];
const writeQuery = [{ $project: { _id: 0, id: 1, ...model } }];

export default { readQuery, writeQuery };
