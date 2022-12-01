import express from 'express';
import rateLimit from 'express-rate-limit';

import { createContext, setGeneratedInternalIdInContext } from '../commons/middlewares/context.middlewares';
import { saveInStore } from '../commons/middlewares/event.middlewares';
import { requireRoles } from '../commons/middlewares/rbac.middlewares';
import { contactRepository as repository } from '../commons/repositories';
import { sendContactMessageByEmail } from './contacts.middlewares';
import readQuery from '../commons/queries/contacts.query';
import { contacts as resource } from '../resources';
import controllers from '../commons/middlewares/crud.middlewares';

const router = new express.Router();

const maxRequestsPerHour = (max) => rateLimit({
  windowMs: 60 * 60 * 1000,
  max,
  message: 'Trop de requêtes, essayez à nouveau dans une heure.',
});

router.route(`/${resource}`)
  .get(requireRoles(['admin']), controllers.list(repository, readQuery))
  .post([
    maxRequestsPerHour(5),
    requireRoles(['user', 'admin']),
    sendContactMessageByEmail,
    createContext,
    setGeneratedInternalIdInContext(resource),
    controllers.create(repository, readQuery),
    saveInStore(resource),
  ]);

export default router;
