import express from 'express';
import structuresControllers from './controllers/structures.controllers';
import statusesControllers from './controllers/status.controllers';
import namesControllers from './controllers/names.controllers';
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

export default router;
