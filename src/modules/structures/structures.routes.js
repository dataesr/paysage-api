import express from 'express';
import structuresControllers from './controllers/structures.controllers';
import identifiersControllers from './controllers/identifiers.controllers';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { addInsertMetaToPayload, addUpdateMetaToPayload } from '../commons/middlewares/metas.middlewares';

const router = new express.Router();
router.use(requireActiveUser);
router.get('/structures', structuresControllers.list);
router.post('/structures', addInsertMetaToPayload, structuresControllers.create);
router.delete('/structures/:structureId', structuresControllers.delete);
router.get('/structures/:structureId', structuresControllers.read);
router.patch('/structures/:structureId', addUpdateMetaToPayload, structuresControllers.update);

router.get('/structures/:structureId/identifiers', identifiersControllers.list);
router.post('/structures/:structureId/identifiers', addInsertMetaToPayload, identifiersControllers.create);
router.delete('/structures/:structureId/identifiers/:identifierId', identifiersControllers.delete);
router.get('/structures/:structureId/identifiers/:identifierId', identifiersControllers.read);
router.patch(
  '/structures/:structureId/identifiers/:identifierId',
  addUpdateMetaToPayload,
  identifiersControllers.update,
);

export default router;
