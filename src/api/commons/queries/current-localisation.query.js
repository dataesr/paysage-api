export default [
  {
    $set: {
      currentLocalisation: {
        $reduce: {
          input: '$localisations',
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
            input: '$localisation',
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
  { $project: { currentLocalisation: { createdAt: 0, updatedAt: 0, updateBy: 0, createdBy: 0 } } },
];
