import express from 'express';
import usersControllers from './controllers/users.controllers';
import meControllers from './controllers/me.controllers';
import { requireActiveUser, requireRoles } from '../commons/middlewares/rbac.middlewares';
import { addUpdateMetaToPayload, addInsertMetaToPayload } from '../commons/middlewares/metas.middlewares';
import { verifyCurrentPassword } from './users.middlewares';

const usersRoutes = new express.Router();

usersRoutes.use(requireActiveUser);
usersRoutes.get('/users/:id', requireRoles(['admin']), usersControllers.getUser);
usersRoutes.patch('/users/:id', requireRoles(['admin']), usersControllers.updateUser);
usersRoutes.delete('/users/:id', requireRoles(['admin']), addUpdateMetaToPayload, usersControllers.deleteUser);
usersRoutes.post('/users', requireRoles(['admin']), addInsertMetaToPayload, usersControllers.createUser);
usersRoutes.get('/users', requireRoles(['admin']), usersControllers.listUsers);

usersRoutes.get('/me', meControllers.getMe);
usersRoutes.patch('/me', addUpdateMetaToPayload, meControllers.updateMe);
usersRoutes.delete('/me', meControllers.deleteMe);
usersRoutes.put('/me/password', verifyCurrentPassword, meControllers.setPassword);

export default usersRoutes;
