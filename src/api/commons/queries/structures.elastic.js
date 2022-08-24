import metas from './metas.query';
import currentLocalisationQuery from './current-localisation.query';
import currentNameQuery from './current-name.query';

export default [
  ...metas,
  ...currentLocalisationQuery,
  ...currentNameQuery,
  {
    $project: {
      _id: 0,
      id: 1,
      localisations: {
        locality: 1,
      },
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
      currentLocalisation: { $ifNull: ['$currentLocalisation', {}] },
      currentName: { $ifNull: ['$currentName', {}] },
    },
  },
];
