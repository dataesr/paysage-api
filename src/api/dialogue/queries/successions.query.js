import currentNameQuery from '../../commons/queries/current-name.query';

// Paysage records a succession as a `structure-predecesseur` relation, held by
// the SUCCESSOR (`resourceId`) and pointing at its PREDECESSOR (`relatedObjectId`).
// Read from one end or the other, the same relation gives a structure's
// predecessors or its successors. Dialogue only PROPOSES them: taking over a
// structure stays a human decision there.
function getLinkedStructures(from, to) {
  return [
    // A structure does not succeed itself: such a loop would pass for a candidate.
    { $match: { relationTag: 'structure-predecesseur', $expr: { $ne: [`$${from}`, `$${to}`] } } },
    {
      $lookup: {
        from: 'relationtypes',
        localField: 'relationTypeId',
        foreignField: 'id',
        as: 'relationType',
      },
    },
    { $set: { relationType: { $arrayElemAt: ['$relationType', 0] } } },
    {
      $lookup: {
        from: 'structures',
        localField: to,
        foreignField: 'id',
        pipeline: [{ $match: { isDeleted: { $ne: true } } }, ...currentNameQuery],
        as: 'structure',
      },
    },
    { $unwind: '$structure' },
    { $sort: { startDate: 1 } },
    {
      $project: {
        _id: 0,
        structureId: `$${from}`,
        id: '$structure.id',
        usualName: { $ifNull: ['$structure.currentName.usualName', null] },
        status: { $ifNull: ['$structure.structureStatus', null] },
        closureDate: { $ifNull: ['$structure.closureDate', null] },
        // When the succession took effect.
        date: { $ifNull: ['$startDate', null] },
        relationType: {
          $cond: [
            { $ifNull: ['$relationType.id', false] },
            { id: '$relationType.id', name: '$relationType.name' },
            null,
          ],
        },
      },
    },
  ];
}

export const predecessorsQuery = getLinkedStructures('resourceId', 'relatedObjectId');
export const successorsQuery = getLinkedStructures('relatedObjectId', 'resourceId');
