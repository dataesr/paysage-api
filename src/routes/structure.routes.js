import express from 'express';
import structureControllers from '../controllers/structure.controllers';

const router = new express.Router();
router.get('/structures', structureControllers.getAllStructures);
router.post('/structures', structureControllers.addStructure);
router.get('/structure/:id/identifiers', structureControllers.getAllIdentifiers);
// router.post('/structure/:id/identifiers', structureControllers.create);
// router.get('/structure/:id', structureControllers.findOne);
// router.put('/structure/:id', structureControllers.update);
// router.delete('/structure/:id', structureControllers.delete);

export default router;
