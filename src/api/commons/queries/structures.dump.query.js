import currentNameQuery from './current-name.query';
import currentIdentifiersQuery from './current-identifiers.query';


export default [
  ...currentNameQuery,
  ...currentIdentifiersQuery,
  {
    $project: {
      _id: 0,
      id: 1,
      displayName: '$currentName.usualName',
      href: { $concat: ['/structures/', '$id'] },
      identifiers: 1,
    },
  },
];
