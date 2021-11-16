export function addInsertMeta(data, actor) {
  return {
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: actor,
    createdBy: actor,
    ...data,
  };
}

export function addUpdateMeta(data, actor) {
  return { updatedAt: new Date(), updatedBy: actor, ...data };
}
