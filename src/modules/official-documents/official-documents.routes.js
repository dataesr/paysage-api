import express from 'express';
import officialDocumentsControllers from './official-documents.controllers';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';

const router = new express.Router();

// GLOBAL MIDDELWARES
router.use(requireActiveUser);

// OFFICIAL DOCUMENTS
router.get('/official-documents', officialDocumentsControllers.list);
router.post('/official-documents', officialDocumentsControllers.create);
router.get('/official-documents/:officialDocumentId', officialDocumentsControllers.read);
router.patch('/official-documents/:officialDocumentId', officialDocumentsControllers.update);
router.delete('/official-documents/:officialDocumentId', officialDocumentsControllers.delete);

export default router;
