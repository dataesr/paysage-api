import express from 'express';
import categoriesControllers from './controllers/categories.controllers';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';

const router = new express.Router();
router.use(requireActiveUser);
router.get('/categories', categoriesControllers.list);
router.post('/categories', categoriesControllers.create);
router.delete('/categories/:categoryId', categoriesControllers.delete);
router.get('/categories/:categoryId', categoriesControllers.read);
router.patch('/categories/:categoryId', categoriesControllers.update);

export default router;
