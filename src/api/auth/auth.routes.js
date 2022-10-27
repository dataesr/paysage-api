import express from 'express';
import rateLimit from 'express-rate-limit';

import {
  createContext,
  setGeneratedInternalIdInContext,
} from '../commons/middlewares/context.middlewares';
import { saveInElastic } from '../commons/middlewares/event.middlewares';
import elasticQuery from '../commons/queries/users.elastic';
import { usersRepository as repository } from '../commons/repositories';
import {
  refreshAccessToken,
  resetPassword,
  signin,
  signout,
  signup,
} from './auth.middlewares';
import { users as resource } from '../resources';

const authRoutes = new express.Router();

const maxRequestsPerHour = (max) => rateLimit({
  windowMs: 60 * 60 * 1000,
  max,
  message: 'Trop de requêtes, essayez à nouveau dans une heure.',
});

authRoutes.post('/signup', [
  maxRequestsPerHour(5),
  createContext,
  setGeneratedInternalIdInContext('user'),
  signup,
  saveInElastic(repository, elasticQuery, resource),
]);
authRoutes.post('/signin', [maxRequestsPerHour(1000), signin]);
authRoutes.post('/signout', [signout]);
authRoutes.post('/token', [refreshAccessToken]);
authRoutes.post('/recovery/password', [maxRequestsPerHour(6), resetPassword]);

export default authRoutes;
