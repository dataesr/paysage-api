import parseSortParams from '../../commons/libs/helpers';
import { db } from '../../../services/mongo.service';

export function setFilters(req, res, next) {
  const { dataset, resourceId } = req.params;
  if (!req.query.filters) { req.query.filters = {}; }
  req.query.filters.dataset = dataset;
  req.query.filters.resourceId = resourceId;
  return next();
}

export async function find(req, res, next) {
  const { filters = [], limit = 5000, skip = 0, sort = null } = req?.query || {};
  const countPipeline = [{ $match: filters }, { $count: 'totalCount' }];
  const queryPipeline = [
    { $match: filters },
    { $skip: skip },
  ];
  if (sort) { queryPipeline.push({ $sort: parseSortParams(sort) }); }
  queryPipeline.push({ $limit: limit });
  const data = await db.collection('keynumbers').aggregate([
    { $facet: { data: queryPipeline, total: countPipeline } },
    { $project: { data: 1, total: { $arrayElemAt: ['$total', 0] } } },
    { $project: { data: 1, totalCount: '$total.totalCount' } },
  ]).toArray();
  res.status(200).json(data[0]);
  return next();
}
