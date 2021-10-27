import getUniqueId from './get-unique-id';

export async function addInsertMeta(data, actor) {
  const id = await getUniqueId();
  return {
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: actor,
    createdBy: actor,
    ...data,
  };
}

export function addUpdateMeta(data, actor = null) {
  return { updatedAt: new Date(), updatedBy: actor, ...data };
}
