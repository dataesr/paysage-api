import metas from './metas.query';

export default [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      firstName: 1,
      lastName: 1,
      names: [{
        firstName: '$firstName',
        lastName: '$lastName',
        otherNames: '$otherNames',
      }],
    },
  },
];
