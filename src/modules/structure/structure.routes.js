import express from 'express';
import structureControllers from './structure.controllers';

const router = new express.Router();
router.get('/all', structureControllers.getAll);
router.delete('/all', structureControllers.deleteAll);
router.get('/:id', structureControllers.getById);
router.post('/add', structureControllers.addOne);

router.get('/:id/description', structureControllers.getDescription);
router.patch('/:id/description', structureControllers.updateDescription);

export default router;
