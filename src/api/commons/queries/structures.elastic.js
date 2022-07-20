import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      names: {
        officialName: 1,
        usualName: 1,
        shortName: 1,
        brandName: 1,
        nameEn: 1,
        acronymFr: 1,
        acronymEn: 1,
        acronymLocal: 1,
        otherNames: 1,
      },
    },
  },
];
