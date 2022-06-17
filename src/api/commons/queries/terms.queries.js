import metas from './metas';

const readQuery = [
  ...metas,
  {
    $lookup: {
      from: 'terms',
      localField: 'parentIds',
      foreignField: 'id',
      as: 'parents',
    },
  },
  {
    $project: {
      _id: 0,
      parentIds: 0,
      parents: {
        _id: 0,
        createdBy: 0,
        updatedBy: 0,
        createdAt: 0,
        updatedAt: 0,
        descriptionFr: 0,
        descriptionEn: 0,
      },
    },
  },
];

const writeQuery = [{
  $project: {
    _id: 0,
    nameFr: 1,
    nameEn: 1,
    descriptionFr: 1,
    descriptionEn: 1,
    parentIds: 1,

  },
}];

const referenceQuery = [{
  $project: {
    _id: 0,
    id: 1,
    usualNameFr: 1,
    acronymFr: 1,
    shortNameFr: 1,
    pluralNameFr: 1,
    descriptionFr: 1,
    nameEn: 1,
    nameFr: 1,
    shortNameEn: 1,
  },
}];

const checkQuery = [{ $project: { _id: 0, id: 1 } }];

export {
  checkQuery,
  readQuery,
  referenceQuery,
  writeQuery,
};
