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

const maxRequestsPerHourPerAccount = (max) => rateLimit({
  windowMs: 60 * 60 * 1000,
  max,
  keyGenerator: (req) => String(req.body?.email || '').toLowerCase(),
  message: 'Trop de tentatives pour ce compte, essayez à nouveau dans une heure.',
});

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
authRoutes.post('/signin', [maxRequestsPerHour(30), maxRequestsPerHourPerAccount(10), signin]);
authRoutes.post('/signout', [signout]);
authRoutes.post('/token', [refreshAccessToken]);
authRoutes.post('/recovery/password', [maxRequestsPerHour(6), maxRequestsPerHourPerAccount(6), resetPassword]);

export default authRoutes;
