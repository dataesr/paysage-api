export default [
  {
    $project: {
      names: {
        $filter: {
          input: '$names',
          as: 'name',
          cond: {
            $and: [
              { $lte: ['$$name.startDate', new Date().toISOString().split('T')[0]] },
              { $gte: ['$$name.endDate', new Date().toISOString().split('T')[0]] },
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
