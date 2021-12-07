import express from 'express';
import structuresControllers from './controllers/structures.controllers';
import identifiersControllers from './controllers/identifiers.controllers';
import namesControllers from './controllers/names.controllers';
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

router.get('/structures/:structureId/names', namesControllers.list);
router.post('/structures/:structureId/names', addInsertMetaToPayload, namesControllers.create);
router.delete('/structures/:structureId/names/:nameId', namesControllers.delete);
router.get('/structures/:structureId/names/:nameId', namesControllers.read);
router.patch(
  '/structures/:structureId/names/:nameId',
  addUpdateMetaToPayload,
  namesControllers.update,
);

export default router;
