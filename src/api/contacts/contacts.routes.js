import express from 'express';
import { createContext, setGeneratedInternalIdInContext } from '../commons/middlewares/context.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import { requireRoles } from '../commons/middlewares/rbac.middlewares';
import { contactRepository as repository } from '../commons/repositories';
import { sendContactMessageByEmail } from './contacts.middlewares';
import readQuery from '../commons/queries/contacts.query';
import { contacts as resource } from '../resources';
const router = new express.Router();


router.route(`/${resource}`)
  .get(requireRoles(['admin']), controllers.list(repository, readQuery))
  .post([
    sendContactMessageByEmail,
    createContext,
    setGeneratedInternalIdInContext(resource),
    controllers.create(repository, readQuery),
    saveInStore(resource),
  ]);

export default router;
