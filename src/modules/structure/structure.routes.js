import express from 'express';
import structureControllers from './structure.controllers';
import { handleErrors } from '../commons/middlewares/handle-errors.middlewares';

const router = new express.Router();
router.get('/', handleErrors, structureControllers.getAll);
router.delete('/', handleErrors, structureControllers.deleteAll);
router.post('/', handleErrors, structureControllers.addOne);
router.get('/:id', handleErrors, structureControllers.getById);
router.patch('/:id', handleErrors, structureControllers.update);

router.get('/:id/identifiers', handleErrors, structureControllers.getIdentifiers);
router.patch('/:id/identifiers', handleErrors, structureControllers.updateIdentifiers);

export default router;
