import metas from '../../commons/pipelines/metas';

const currentNamePipeline = [
  {
    $set: {
      currentName: {
        $reduce: {
          input: '$names',
          initialValue: null,
          in: {
            $cond: [
              { $gt: ['$$this.startDate', '$$value.startDate'] }, '$$this', '$$value',
            ],
          },
        },
      },
    },
  },
  {
    $set: {
      currentName: {
        $ifNull: ['$currentName', {
          $reduce: {
            input: '$names',
            initialValue: null,
            in: {
              $cond: [
                { $gt: ['$$this.createdAt', '$$value.createdAt'] }, '$$this', '$$value',
              ],
            },
          },
        }],
      },
    },
  },
  { $project: { currentName: { createdAt: 0, updatedAt: 0, updateBy: 0, createdBy: 0 } } },
];

const currentLocalisationPipeline = [
  {
    $set: {
      currentLocalisation: {
        $reduce: {
          input: '$localisations',
          initialValue: null,
          in: {
            $cond: [
              { $gt: ['$$this.startDate', '$$value.startDate'] }, '$$this', '$$value',
            ],
          },
        },
      },
    },
  },
  {
    $set: {
      currentLocalisation: {
        $ifNull: ['$currentLocalisation', {
          $reduce: {
            input: '$localisation',
            initialValue: null,
            in: {
              $cond: [
                { $gt: ['$$this.createdAt', '$$value.createdAt'] }, '$$this', '$$value',
              ],
            },
          },
        }],
      },
    },
  },
  { $project: { currentLocalisation: { createdAt: 0, updatedAt: 0, updateBy: 0, createdBy: 0 } } },
];

const model = {
  structureStatus: { $ifNull: ['$structureStatus', null] },
  creationDate: { $ifNull: ['$creationDate', null] },
  creationOfficialDocumentId: { $ifNull: ['$creationOfficialDocumentId', null] },
  closureDate: { $ifNull: ['$closureDate', null] },
  closureOfficialDocumentId: { $ifNull: ['$closureOfficialDocumentId', null] },
  creationReason: { $ifNull: ['$creationReason', null] },
  descriptionFr: { $ifNull: ['$descriptionFr', null] },
  descriptionEn: { $ifNull: ['$descriptionEn', null] },
};

const readQuery = [
  ...metas,
  ...currentNamePipeline,
  ...currentLocalisationPipeline,
  {
    $project: {
      _id: 0,
      id: 1,
      ...model,
      status: 1,
      alternativePaysageIds: { $ifNull: ['$alternativePaysageIds', []] },
      currentName: { $ifNull: ['$currentName', {}] },
      currentLocalisation: { $ifNull: ['$currentLocalisation', {}] },
      redirection: { $ifNull: ['$redirection', null] },
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];

const writeQuery = [{ $project: { _id: 0, id: 1, structureStatus: 1 } }];

const lightQuery = [...currentNamePipeline, { $project: { _id: 0, id: 1, structureStatus: 1, currentName: 1 } }];

const checkQuery = [{ $project: { _id: 0, id: 1 } }];

const indexQuery = [{ $project: { _id: 0, id: 1, status: 1 } }];

export {
  checkQuery,
  indexQuery,
  lightQuery,
  readQuery,
  writeQuery,
};
