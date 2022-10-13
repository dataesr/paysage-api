import metas from './metas.query';
import emailTypesLightQuery from './email-types.light.query';

export default [
  ...metas,
  {
    $lookup: {
      from: 'emailtypes',
      localField: 'emailTypeId',
      foreignField: 'id',
      pipeline: emailTypesLightQuery,
      as: 'emailType',
    },
  },
  { $set: { emailType: { $arrayElemAt: ['$emailType', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      resourceId: 1,
      emailType: 1,
      emailTypeId: 1,
      email: 1,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];
