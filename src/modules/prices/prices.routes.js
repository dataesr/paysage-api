import express from 'express';
import BaseControllers from '../commons/controllers/base.controllers';
import pricesRepository from './prices.repository';

class PriceControllers extends BaseControllers {}
const pricesControllers = new PriceControllers(pricesRepository);
pricesControllers.create.bind(this);
console.log('ROUTES', pricesControllers.create);
const router = new express.Router();
router.get('/prices', pricesControllers.list);
router.post('/prices', (req, res, next) => {
  console.log('ROUTE', pricesControllers._repository);
  next();
}, pricesControllers.create);
router.delete('/prices/:id', pricesControllers.delete);
router.get('/prices/:id', pricesControllers.read);
router.patch('/prices/:id', pricesControllers.patch);

export default router;
