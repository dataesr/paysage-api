import metas from './metas.query';

export default [
  ...metas,
  {
    $set: {
      coordinates: {
        $cond: [
          { $or: [
            { $eq: [{ $ifNull: ['$geometry.coordinates.lat', null] }, null] },
            { $eq: [{ $ifNull: ['$geometry.coordinates.lng', null] }, null] },
          ] },
          null,
          { lat: { $last: '$geometry.coordinates' }, lng: { $first: '$geometry.coordinates' } },
        ],
      },
    },
  },
  {
    $group: {
      _id: null,
      data: { $push: '$$ROOT' },
    },
  },
  {
    $set: {
      currentLocalisation: {
        $reduce: {
          input: '$data',
          initialValue: null,
          in: {
            $cond: [
              { $gt: ['$$this.startDate', '$$value.startDate'] }, '$$this.id', '$$value.id',
            ],
          },
        },
      },
    },
  },
  {
    $set: {
      currentLocalisation: {
        $ifNull: ['$currentLocalisation', {
          $reduce: {
            input: '$data',
            initialValue: null,
            in: {
              $cond: [
                { $gt: ['$$this.createdAt', '$$value.createdAt'] }, '$$this.id', '$$value.id',
              ],
            },
          },
        }],
      },
    },
  },
  { $unwind: '$data' },
  { $set: { current: { $cond: [{ $eq: ['$currentLocalisation', '$data.id'] }, true, false] } } },
  { $replaceRoot: { newRoot: { $mergeObjects: ['$$ROOT', '$data'] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      address: 1,
      cityId: { $ifNull: ['$cityId', null] },
      city: { $ifNull: ['$city', null] },
      distributionStatement: { $ifNull: ['$distributionStatement', null] },
      country: 1,
      postOfficeBoxNumber: { $ifNull: ['$postOfficeBoxNumber', null] },
      postalCode: { $ifNull: ['$postalCode', null] },
      locality: { $ifNull: ['$locality', null] },
      place: { $ifNull: ['$place', null] },
      phonenumber: { $ifNull: ['$phonenumber', null] },
      coordinates: 1,
      startDate: { $ifNull: ['$startDate', null] },
      endDate: { $ifNull: ['$endDate', null] },
      current: 1,
      active: { $ifNull: ['$active', null] },
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];
