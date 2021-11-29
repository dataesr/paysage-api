import express from 'express';
import structureControllers from '../controllers/structure.controllers';

const router = new express.Router();
router.get('/all', structureControllers.getAll);
router.get('/:id', structureControllers.getOne);
router.post('/add', structureControllers.add);
router.post('/:id/description', structureControllers.updateOne);

export default router;
