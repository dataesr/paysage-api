import express from 'express';
import Controllers from '../commons/controllers/base.controllers';
import pricesRepository from './prices.repository';

const pricesControllers = new Controllers(pricesRepository);

const router = new express.Router();
router.get('/prices', pricesControllers.list);
router.post('/prices', pricesControllers.create);
router.delete('/prices/:id', pricesControllers.delete);
router.get('/prices/:id', pricesControllers.read);
router.patch('/prices/:id', pricesControllers.patch);

export default router;
