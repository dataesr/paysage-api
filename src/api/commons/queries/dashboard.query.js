export default [
  {
    $facet: {
      byUser: [
        {
          $group:
            {
              _id: '$userId',
              totalOperations: { $sum: 1 },
            },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'id',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: 1,
                  firstName: 1,
                  lastName: 1,
                  avatar: { $ifNull: ['$avatar', null] },
                },
              },
            ],
            as: 'user',
          },
        },
        { $set: { user: { $arrayElemAt: ['$user', 0] } } },
        { $set: { displayName: { $concat: ['$user.firstName', ' ', '$user.lastName'] } } },
        { $sort: { totalOperations: -1 } },
      ],
      byObject: [
        { $match: { subResourceType: null, method: 'POST' } },
        {
          $group:
            {
              _id: { resourceType: '$resourceType' },
              totalOperations: { $sum: 1 },
            },
        },
        { $set: { displayName: '$_id.resourceType' } },
        { $sort: { totalOperations: -1 } },
      ],
    },
  },
];
