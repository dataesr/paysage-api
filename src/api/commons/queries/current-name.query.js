export default [
  {
    $project: {
      names: {
        $filter: {
          input: '$names',
          as: 'name',
          cond: {
            $and: [
              { $lte: ['$$name.startDate', '$NOW'] },
              { $gte: ['$$name.endDate', '$NOW'] },
            ],
          },
        },
      },
    },
  },
  {
    $set: {
      currentName: {
        $reduce: {
          input: '$names',
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
      currentName: {
        $ifNull: ['$currentName', {
          $reduce: {
            input: '$names',
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
  { $project: { currentName: { createdAt: 0, updatedAt: 0, updateBy: 0, createdBy: 0 } } },
];
