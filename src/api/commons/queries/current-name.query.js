export default [
  {
    $set: {
      names: {
        $map: {
          input: '$names',
          in: { $mergeObjects: ['$$this', { startDate: { $concat: ['$$this.startDate', '-01-01'] } }] },
        },
      },
    },
  },
  {
    $set: {
      names: {
        $map: {
          input: '$names',
          in: {
            $cond: [
              { $ifNull: ['$$this.startDate', 0] },
              { $mergeObjects: ['$$this', { startDate: { $substr: ['$$this.startDate', 0, 10] } }] },
              '$$this',
            ],
          },
        },
      },
    },
  },
  {
    $set: {
      filteredNames: {
        $filter: {
          input: '$names',
          cond: { $lte: [{ $toDate: '$$this.startDate' }, '$$NOW'] },
        },
      },
    },
  },
  {
    $set: {
      currentName: {
        $reduce: {
          input: '$filteredNames',
          initialValue: null,
          in: { $cond: [{ $gt: ['$$this.startDate', '$$value.startDate'] }, '$$this', '$$value'] },
        },
      },
    },
  },
  {
    $set: {
      currentName: {
        $ifNull: ['$currentName', {
          $reduce: {
            input: '$filteredNames',
            initialValue: null,
            in: { $cond: [{ $gt: ['$$this.createdAt', '$$value.createdAt'] }, '$$this', '$$value'] },
          },
        }],
      },
    },
  },
  { $project: { currentName: { createdAt: 0, updatedAt: 0, updateBy: 0, createdBy: 0 } } },
];
