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
  const { filters = [], limit = 20, skip = 0, sort = null } = req?.query || {};
  const queryPipeline = [
    { $match: filters },
    { $setWindowFields: { output: { totalCount: { $count: {} } } } },
  ];
  if (sort) { queryPipeline.push({ $sort: parseSortParams(sort) }); }
  if (skip) { queryPipeline.push({ $skip: skip }); }
  if (limit && limit > 0) { queryPipeline.push({ $limit: limit }); }
  const pipeline = [
    ...queryPipeline,
    { $group: { _id: null, data: { $push: "$$ROOT" }, totalCount: { $max: "$totalCount" } } },
    { $project: { _id: 0, 'data.totalCount': 0 } }
  ]
  const data = await db.collection('keynumbers').aggregate(pipeline).toArray();
  res.status(200).json(data?.[0]?.data ? data[0] : { data: [], totalCount: 0 });
  return next();
}
