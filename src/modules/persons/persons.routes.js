import express from 'express';
import personsControllers from './controllers/persons.controllers';

const router = new express.Router();
router.get('/persons', personsControllers.list);
router.post('/persons', personsControllers.create);
router.delete('/persons/:personId', personsControllers.delete);
router.get('/persons/:personId', personsControllers.read);
router.patch('/persons/:personId', personsControllers.update);

export default router;
