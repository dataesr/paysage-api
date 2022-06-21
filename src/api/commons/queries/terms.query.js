import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      usualNameFr: 1,
      usualNameEn: 1,
      pluralNameFr: 1,
      pluralNameEn: 1,
      shortNameFr: 1,
      shortNameEn: 1,
      acronymFr: 1,
      acronymEn: 1,
      descriptionFr: 1,
      descriptionEn: 1,
      otherNames: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];
