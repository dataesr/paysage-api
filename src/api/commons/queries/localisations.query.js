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
              { $gt: ['$$this.startDate', '$$value.startDate'] }, '$$this', '$$value',
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
                { $gt: ['$$this.createdAt', '$$value.createdAt'] }, '$$this', '$$value',
              ],
            },
          },
        }],
      },
    },
  },
  { $unwind: '$data' },
  { $set: { current: { $cond: [{ $eq: ['$currentLocalisation.id', '$data.id'] }, true, false] } } },
  { $replaceRoot: { newRoot: { $mergeObjects: ['$$ROOT', '$data'] } } },
  {
    $project: {
      _id: 0,
      active: { $ifNull: ['$active', null] },
      address: 1,
      city: { $ifNull: ['$city', null] },
      cityId: { $ifNull: ['$cityId', null] },
      coordinates: 1,
      country: 1,
      createdAt: 1,
      createdBy: 1,
      current: 1,
      distributionStatement: { $ifNull: ['$distributionStatement', null] },
      endDate: { $ifNull: ['$endDate', null] },
      id: 1,
      iso3: { $ifNull: ['$iso3', null] },
      locality: { $ifNull: ['$locality', null] },
      phonenumber: { $ifNull: ['$phonenumber', null] },
      place: { $ifNull: ['$place', null] },
      postalCode: { $ifNull: ['$postalCode', null] },
      postOfficeBoxNumber: { $ifNull: ['$postOfficeBoxNumber', null] },
      startDate: { $ifNull: ['$startDate', null] },
      updatedAt: 1,
      updatedBy: 1,
    },
  },
];
