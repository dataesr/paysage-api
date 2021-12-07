import express from 'express';
import officialDocumentsControllers from './controllers/official-documents.controllers';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';
import { addInsertMetaToPayload, addUpdateMetaToPayload } from '../commons/middlewares/metas.middlewares';

const router = new express.Router();
router.use(requireActiveUser);
router.get('/official-documents', officialDocumentsControllers.list);
router.post('/official-documents', addInsertMetaToPayload, officialDocumentsControllers.create);
router.delete('/official-documents/:officialDocumentId', officialDocumentsControllers.delete);
router.get('/official-documents/:officialDocumentId', officialDocumentsControllers.read);
router.patch('/official-documents/:officialDocumentId', addUpdateMetaToPayload, officialDocumentsControllers.update);

export default router;
