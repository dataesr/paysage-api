import currentCategoryQuery from '../../commons/queries/current-category.query';
import currentLocalisationQuery from '../../commons/queries/current-localisation.query';
import currentNameQuery from '../../commons/queries/current-name.query';

export default [
  { $set: { enteredNames: { $ifNull: ['$names', []] } } },
  ...currentLocalisationQuery,
  ...currentNameQuery,
  ...currentCategoryQuery,
  {
    $lookup: {
      from: 'identifiers',
      localField: 'id',
      foreignField: 'resourceId',
      pipeline: [
        {
          $project: {
            _id: 0,
            type: 1,
            value: 1,
            active: { $ifNull: ['$active', null] },
            startDate: { $ifNull: ['$startDate', null] },
            endDate: { $ifNull: ['$endDate', null] },
          },
        },
      ],
      as: 'identifiers',
    },
  },
  {
    $project: {
      _id: 0,
      id: 1,
      status: { $ifNull: ['$structureStatus', null] },
      creationDate: { $ifNull: ['$creationDate', null] },
      closureDate: { $ifNull: ['$closureDate', null] },
      alternativePaysageIds: { $ifNull: ['$alternativePaysageIds', []] },
      currentName: {
        usualName: { $ifNull: ['$currentName.usualName', null] },
        officialName: { $ifNull: ['$currentName.officialName', null] },
        shortName: { $ifNull: ['$currentName.shortName', null] },
        acronymFr: { $ifNull: ['$currentName.acronymFr', null] },
        nameEn: { $ifNull: ['$currentName.nameEn', null] },
      },
      names: {
        $map: {
          input: '$enteredNames',
          in: {
            usualName: { $ifNull: ['$$this.usualName', null] },
            officialName: { $ifNull: ['$$this.officialName', null] },
            shortName: { $ifNull: ['$$this.shortName', null] },
            acronymFr: { $ifNull: ['$$this.acronymFr', null] },
            otherNames: { $ifNull: ['$$this.otherNames', []] },
            startDate: { $ifNull: ['$$this.startDate', null] },
            endDate: { $ifNull: ['$$this.endDate', null] },
          },
        },
      },
      categories: {
        $map: {
          input: { $ifNull: ['$categories', []] },
          in: {
            id: '$$this.id',
            usualNameFr: { $ifNull: ['$$this.usualNameFr', null] },
            priority: { $ifNull: ['$$this.priority', 99] },
          },
        },
      },
      localisation: {
        address: { $ifNull: ['$currentLocalisation.address', null] },
        postalCode: { $ifNull: ['$currentLocalisation.postalCode', null] },
        locality: { $ifNull: ['$currentLocalisation.locality', null] },
        city: { $ifNull: ['$currentLocalisation.city', null] },
        country: { $ifNull: ['$currentLocalisation.country', null] },
      },
      identifiers: 1,
      updatedAt: { $ifNull: ['$updatedAt', { $ifNull: ['$createdAt', null] }] },
    },
  },
];
