import metas from './metas.query';
import { refreshTokenExpiresIn } from '../../../config';

export default [
  ...metas,
  {
    $lookup: {
      from: 'groupmembers',
      localField: 'id',
      foreignField: 'userId',
      pipeline: [
        {
          $project: {
            _id: 0,
            groupId: 1,
          },
        },
      ],
      as: 'membership',
    },
  },
  { $set: { membership: '$membership.groupId' } },
  {
    $lookup: {
      from: 'groups',
      localField: 'membership',
      foreignField: 'id',
      pipeline: [
        {
          $project: {
            _id: 0,
            id: 1,
            name: 1,
            acronym: { $ifNull: ['$acronym', null] },
          },
        },
      ],
      as: 'groups',
    },
  },
  {
    $lookup: {
      from: 'tokens',
      localField: 'id',
      foreignField: 'userId',
      pipeline: [
        { $sort: { expireAt: -1 } },
        {
          $project: {
            date: { $dateSubstract: { startDate: "$expireAt", unit: 'days', amount: refreshTokenExpiresIn } },
          },
        },
      ],
      as: 'lastVisit',
    },
  },
  { $set: { lastVisit: { $arrayElemAt: ['$lastVisit', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      email: 1,
      role: 1,
      firstName: 1,
      lastName: 1,
      lastLogin: 1,
      avatar: { $ifNull: ['$avatar', null] },
      service: { $ifNull: ['$service', null] },
      position: { $ifNull: ['$position', null] },
      confirmed: 1,
      isDeleted: { $ifNull: ['$isDeleted', false] },
      isOtpRequired: 1,
      lastVisit: '$lastVisit.date',
      groups: 1,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];
