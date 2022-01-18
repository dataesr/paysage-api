import express from 'express';
import structuresControllers from './controllers/structures.controllers';
import statusesControllers from './controllers/status.controllers';
import namesControllers from './controllers/names.controllers';
import identifiersControllers from './controllers/identifiers.controllers';
import localisationsControllers from './controllers/localisations.controllers';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';

const router = new express.Router();

// GLOBAL MIDDELWARES
router.use(requireActiveUser);

// STUCTURES
router.get('/structures', structuresControllers.list);
router.post('/structures', structuresControllers.create);
router.get('/structures/:structureId', structuresControllers.read);
router.patch('/structures/:structureId', structuresControllers.update);
router.delete('/structures/:structureId', structuresControllers.delete);

// STATUSES
router.put('/structures/:structureId/status', statusesControllers.update);

// NAMES
router.get('/structures/:structureId/names', namesControllers.list);
router.post('/structures/:structureId/names', namesControllers.create);
router.delete('/structures/:structureId/names/:nameId', namesControllers.delete);
router.get('/structures/:structureId/names/:nameId', namesControllers.read);
router.patch('/structures/:structureId/names/:nameId', namesControllers.update);

// Identifiers
router.get('/structures/:structureId/identifiers', identifiersControllers.list);
router.post('/structures/:structureId/identifiers', identifiersControllers.create);
router.delete('/structures/:structureId/identifiers/:identifierId', identifiersControllers.delete);
router.get('/structures/:structureId/identifiers/:identifierId', identifiersControllers.read);
router.patch('/structures/:structureId/identifiers/:identifierId', identifiersControllers.update);

// Localisations
router.get('/structures/:structureId/localisations', localisationsControllers.list);
router.post('/structures/:structureId/localisations', localisationsControllers.create);
router.delete('/structures/:structureId/localisations/:localisationId', localisationsControllers.delete);
router.get('/structures/:structureId/localisations/:localisationId', localisationsControllers.read);
router.patch('/structures/:structureId/localisations/:localisationId', localisationsControllers.update);

export default router;
