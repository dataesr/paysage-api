import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        longNameFr: '$longNameFr',
        shortNameFr: '$shortNameFr',
        acronymeFr: '$acronymeFr',
        pluralNameFr: '$pluralNameFr',
        longNameEn: '$longNameEn',
        shortNameEn: '$shortNameEn',
        otherNames: '$otherNames',
      }],
    },
  },
];
