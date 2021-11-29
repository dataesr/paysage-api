import express from 'express';
import structureControllers from './structure.controllers';

const router = new express.Router();
router.get('/all', structureControllers.getAll);
router.get('/:id', structureControllers.getById);
router.post('/add', structureControllers.add);
router.post('/:id/description', structureControllers.updateOne);

export default router;
