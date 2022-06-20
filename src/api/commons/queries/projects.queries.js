import metas from './metas';

const currentLocalisationPipeline = [
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

const model = {
  _id: 0,
  id: 1,
  nameFr: 1,
  nameEn: { $ifNull: ['$nameEn', null] },
  fullNameFr: { $ifNull: ['$fullNameFr', null] },
  fullNameEn: { $ifNull: ['$fullNameEn', null] },
  acronymFr: { $ifNull: ['$acronymFr', null] },
  acronymEn: { $ifNull: ['$acronymEn', null] },
  description: { $ifNull: ['$description', null] },
  startDate: { $ifNull: ['$startDate', null] },
  endDate: { $ifNull: ['$endDate', null] },
  grantPart: { $ifNull: ['$grantPart', null] },
  comment: { $ifNull: ['$comment', null] },
  currentLocalisation: 1,
  createdBy: 1,
  updatedBy: 1,
  createdAt: 1,
  updatedAt: 1,
};

const readQuery = [...metas, ...currentLocalisationPipeline, { $project: { ...model } }];

export { readQuery };
