import { setGeneratedObjectIdInContext } from '../commons/middlewares/context.middlewares';
import { saveInElastic, saveInStore } from '../commons/middlewares/event.middlewares';
import elasticQuery from '../commons/queries/structures.elastic';
import { structuresRepository as repository } from '../commons/repositories';
import { structures as resource } from '../resources';
import { createStructureResponse, fromPayloadToStructure, storeStructure, validateStructureCreatePayload } from '../structures/root/root.middlewares';

export async function bulkImportStructures(req, res, next) {
  const data = req.body;
  let hasError = true;
  const results = await Promise.all(
    data.map(async (structure) => {
      try {
        const req2 = { ...req };
        const res2 = { ...res };
        // const next2 = { ...next };
        req2.body = structure;
        await validateStructureCreatePayload(req2, res2, next);
        await setGeneratedObjectIdInContext(resource)(req2, res2, next);
        await fromPayloadToStructure(req2, res2, next);
        await storeStructure(req2, res2, next);
        await createStructureResponse(req2, res2, next);
        await saveInStore(resource)(req2, res2, next);
        await saveInElastic(repository, elasticQuery, resource)(req2, res2, next);
        return structure;
      } catch (error) {
        hasError = true;
        return error;
      }
    }),
  );
  res.status(hasError ? 400 : 201).json(results);
  return next();
}
