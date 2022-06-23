import currentLocalisationQuery from './current-localisation.query';
import currentNameQuery from './current-name.query';

export default [
  ...currentNameQuery,
  ...currentLocalisationQuery,
  {
    $project: {
      _id: 0,
      id: 1,
      structureStatus: { $ifNull: ['$structureStatus', null] },
      creationDate: { $ifNull: ['$creationDate', null] },
      closureDate: { $ifNull: ['$closureDate', null] },
      currentName: { $ifNull: ['$currentName', {}] },
      currentLocalisation: { $ifNull: ['$currentLocalisation', {}] },
    },
  },
];
