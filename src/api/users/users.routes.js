import express from 'express';
import usersControllers from './users.controllers';
import { requireRoles } from '../commons/middlewares/rbac.middlewares';
import { addUpdateMetaToPayload, addInsertMetaToPayload } from '../commons/middlewares/metas.middlewares';
import { parseQueryParams } from '../commons/middlewares/parse-parameters.middlewares';

const usersRoutes = new express.Router();

usersRoutes.get('/users/:id', requireRoles(['admin']), usersControllers.getUser);
usersRoutes.patch('/users/:id', requireRoles(['admin']), usersControllers.updateUser);
usersRoutes.delete('/users/:id', requireRoles(['admin']), addUpdateMetaToPayload, usersControllers.deleteUser);
usersRoutes.post('/users', requireRoles(['admin']), addInsertMetaToPayload, usersControllers.createUser);
usersRoutes.get('/users', requireRoles(['admin']), parseQueryParams, usersControllers.listUsers);

export default usersRoutes;
