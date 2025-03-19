import express from 'express';
import { ObjectId } from 'mongodb';
import agenda from '../../jobs';
import { db } from '../../services/mongo.service';
import { BadRequestError } from '../commons/http-errors';
import { parseSortParams } from '../commons/libs/helpers';
import { requireRoles } from '../commons/middlewares/rbac.middlewares';

const router = new express.Router();

function getDateXDaysBefore(x) {
  return new Date(Date.now() - x * 24 * 60 * 60 * 1000);
}
function getDateXDaysAfter(x) {
  return new Date(Date.now() + x * 24 * 60 * 60 * 1000);
}

const SKIP_JOBS = ['send mattermost notification',
  'send welcome email', 'send confirmed email', 'send signin email', 'send recovery email', 'send contact email'];

router.route('/jobs')
  .get([
    requireRoles(['admin']),
    async (req, res) => {
      const { filters = {}, skip = 0, limit = 20, sort = '-nextRunAt,-lastRunAt' } = req.query;
      const { status, ...statusFilter } = filters;
      const stats = await db.collection('_jobs').aggregate([
        {
          $match: {
            name: {
              $nin: SKIP_JOBS,
            },
          },
        },
        {
          $set: {
            status: {
              $switch: {
                branches: [
                  { case: { $eq: ['$type', 'single'] }, then: 'scheduled' },
                  { case: { $ne: [{ $ifNull: ['$failedAt', null] }, null] }, then: 'failed' },
                  { case: { $ne: [{ $ifNull: ['$lockedAt', null] }, null] }, then: 'running' },
                ],
                default: 'success',
              },
            },
          },
        },
        {
          $facet: {
            totalCount: [{ $match: filters }, { $group: { _id: null, totalCount: { $sum: 1 } } }],
            data: [{ $match: filters }, { $sort: parseSortParams(sort) }, { $skip: skip }, { $limit: limit }],
            activity: [
              { $match: statusFilter },
              {
                $addFields: {
                  duration: {
                    $round: [
                      {
                        $divide: [
                          {
                            $subtract: [
                              '$lastFinishedAt',
                              '$lastRunAt',
                            ],
                          },
                          1000,
                        ],
                      },
                    ],
                  },
                },
              },
              { $set: { duration: { $cond: [{ $eq: ['$status', 'scheduled'] }, 0, '$duration'] } } },
              { $set: { duration: { $cond: [{ $eq: ['$status', 'running'] }, 0, '$duration'] } } },
              {
                $set: {
                  date: {
                    $switch: {
                      branches: [
                        { case: { $eq: ['$status', 'scheduled'] }, then: '$nextRunAt' },
                      ],
                      default: '$lastRunAt',
                    },
                  },
                },
              },
              { $match: { date: { $gte: getDateXDaysBefore(7) } } },
              { $match: { date: { $lte: getDateXDaysAfter(1) } } },
              {
                $project: {
                  status: 1,
                  date: { $toLong: '$date' },
                  duration: { $ifNull: ['$duration', 0] },
                  name: 1,
                },
              },
            ],
            status: [
              { $match: statusFilter },
              { $sortByCount: '$status' },
            ],
            name: [
              { $sortByCount: '$name' },
            ],
          },
        },
        { $set: { totalCount: { $arrayElemAt: ['$totalCount', 0] } } },
        {
          $project: {
            totalCount: { $ifNull: ['$totalCount.totalCount', 0] },
            data: 1,
            statuses: 1,
            aggregations: {
              definitions: Object.keys(agenda._definitions).filter((def) => !SKIP_JOBS.includes(def)),
              activity: '$activity',
              byStatus: '$status',
              byName: '$name',
            },
          },
        },
      ]).toArray();
      return res.json(stats?.[0] || {});
    },
  ])
  .post([
    requireRoles(['admin']),
    async (req, res) => {
      const { name, data, repeatInterval } = req.body;
      if (!Object.keys(agenda._definitions).includes(name)) throw new BadRequestError('Unknown task');
      let job = {};
      if (!repeatInterval) {
        job = await agenda.now(name, data);
      }
      if (repeatInterval) {
        job = await agenda.every(repeatInterval, name, data, { skipImmediate: true, timezone: 'Europe/Paris' });
      }
      return res.json(job);
    },
  ]);

router.route('/jobs/:id')
  .delete([
    requireRoles(['admin']),
    async (req, res) => {
      const { id } = req.params;
      const _id = new ObjectId(id);
      await agenda.cancel({ _id });
      return res.status(204).json();
    },
  ]);

export default router;
