import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        nameFr: '$nameFr',
        nameEn: '$nameEn',
        fullNameFr: '$fullNameFr',
        fullNameEn: '$fullNameEn',
        acronymFr: '$acronymFr',
        acronymEn: '$acronymEn',
      }],
    },
  },
];
