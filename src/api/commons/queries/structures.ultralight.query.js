import currentNameQuery from './current-name.query';


export default [
  ...currentNameQuery,
  {
    $project: {
      _id: 0,
      id: 1,
      displayName: '$currentName.usualName',
      href: { $concat: ['/structures/', '$id'] },
    },
  },
];
