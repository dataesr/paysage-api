import express from 'express';
import legalCategoriesControllers from './legal-categories.controllers';
// import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';

const router = new express.Router();
router.get('/legal-categories', legalCategoriesControllers.list);
router.post('/legal-categories', legalCategoriesControllers.create);
router.delete('/legal-categories/:legalCategoryId', legalCategoriesControllers.delete);
router.get('/legal-categories/:legalCategoryId', legalCategoriesControllers.read);
router.patch('/legal-categories/:legalCategoryId', legalCategoriesControllers.update);

export default router;
