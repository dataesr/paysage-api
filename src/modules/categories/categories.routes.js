import express from 'express';
import categoriesControllers from './categories.controllers';

const router = new express.Router();
router.get('/categories', categoriesControllers.list);
router.post('/categories', categoriesControllers.create);
router.delete('/categories/:categoryId', categoriesControllers.delete);
router.get('/categories/:categoryId', categoriesControllers.read);
router.patch('/categories/:categoryId', categoriesControllers.update);

export default router;
