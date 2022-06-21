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
    $project: {
      _id: 0,
      id: 1,
      address: 1,
      cityId: { $ifNull: ['$cityId', null] },
      distributionStatement: { $ifNull: ['$distributionStatement', null] },
      country: 1,
      postOfficeBoxNumber: { $ifNull: ['$postOfficeBoxNumber', null] },
      postalCode: { $ifNull: ['$postalCode', null] },
      locality: { $ifNull: ['$locality', null] },
      place: { $ifNull: ['$place', null] },
      telephone: { $ifNull: ['$telephone', null] },
      coordinates: 1,
      startDate: { $ifNull: ['$startDate', null] },
      endDate: { $ifNull: ['$endDate', null] },
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];
