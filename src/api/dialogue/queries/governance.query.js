const DIRECTION_TEAM = 'Équipe de direction';

const trimmed = (field) => ({ $trim: { input: { $ifNull: [field, ''] } } });

export default [
  { $match: { relationTag: 'gouvernance' } },
  {
    $lookup: {
      from: 'relationtypes',
      localField: 'relationTypeId',
      foreignField: 'id',
      as: 'relationType',
    },
  },
  { $set: { relationType: { $arrayElemAt: ['$relationType', 0] } } },
  { $match: { 'relationType.mandateTypeGroup': DIRECTION_TEAM } },
  {
    $lookup: {
      from: 'persons',
      localField: 'relatedObjectId',
      foreignField: 'id',
      as: 'person',
    },
  },
  { $set: { person: { $arrayElemAt: ['$person', 0] } } },
  { $sort: { 'relationType.priority': 1, startDate: 1 } },
  {
    $project: {
      _id: 0,
      id: 1,
      structureId: '$resourceId',
      startDate: { $ifNull: ['$startDate', null] },
      endDate: { $ifNull: ['$endDate', null] },
      endDatePrevisional: { $ifNull: ['$endDatePrevisional', null] },
      active: { $ifNull: ['$active', null] },
      relationType: {
        id: '$relationType.id',
        name: '$relationType.name',
        priority: { $ifNull: ['$relationType.priority', 99] },
      },
      title: {
        $ifNull: ['$mandatePrecision', {
          $switch: {
            branches: [
              { case: { $eq: ['$person.gender', 'Femme'] }, then: { $ifNull: ['$relationType.feminineName', '$relationType.name'] } },
              { case: { $eq: ['$person.gender', 'Homme'] }, then: { $ifNull: ['$relationType.maleName', '$relationType.name'] } },
            ],
            default: '$relationType.name',
          },
        }],
      },
      temporary: { $eq: ['$mandateTemporary', true] },
      person: {
        id: '$person.id',
        firstName: { $ifNull: ['$person.firstName', null] },
        lastName: { $ifNull: ['$person.lastName', null] },
        gender: { $ifNull: ['$person.gender', null] },
      },
      emails: {
        $filter: {
          input: [
            { address: trimmed('$mandateEmail'), kind: 'generic' },
            { address: trimmed('$personalEmail'), kind: 'nominative' },
          ],
          cond: { $ne: ['$$this.address', ''] },
        },
      },
      updatedAt: { $ifNull: ['$updatedAt', { $ifNull: ['$createdAt', null] }] },
    },
  },
];
