import express from 'express';
import categoriesControllers from './controllers/categories.controllers';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { addInsertMetaToPayload, addUpdateMetaToPayload } from '../commons/middlewares/metas.middlewares';

const router = new express.Router();
router.use(requireActiveUser);
router.get('/categories', categoriesControllers.list);
router.post('/categories', addInsertMetaToPayload, categoriesControllers.create);
router.delete('/categories/:categoryId', categoriesControllers.delete);
router.get('/categories/:categoryId', categoriesControllers.read);
router.patch('/categories/:categoryId', addUpdateMetaToPayload, categoriesControllers.update);

export default router;
