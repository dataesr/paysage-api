import express from 'express';
import controllers from './controllers';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { addInsertMetaToPayload } from '../commons/middlewares/metas.middlewares';

const router = new express.Router();
router.use(requireActiveUser);
router.post('/structures', addInsertMetaToPayload, controllers.createStructure);
router.get('/structures/:structureId', controllers.getStructureById);

export default router;
