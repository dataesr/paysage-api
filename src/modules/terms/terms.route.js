import express from 'express';
import Controllers from '../commons/controllers/base.controllers';
import pricesRepository from './termes.repository';

const termesControllers = new Controllers(termesRepository);

const router = new express.Router();
router.get('/termes', termesControllers.list);
router.post('/termes', termesControllers.create);
router.delete('/termes/:id', termesControllers.delete);
router.get('/termes/:id', termesControllers.read);
router.patch('/termes/:id', termesControllers.patch);

export default router;
