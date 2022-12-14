import jwt from 'jsonwebtoken';
import { apiKeysRepository } from '../repositories';
import config from '../../../config';

const { jwtSecret } = config;

export async function authenticate(req, res, next) {
  const { authorization, 'x-api-key': xApiKey } = req.headers;
  req.currentUser = {};
  if (xApiKey) {
    const apiKey = await apiKeysRepository._collection.findOne({ apiKey: xApiKey });
    if (apiKey.userId) req.currentUser = { id: apiKey.userId, role: apiKey.role };
    console.log(req.currentUser);
    return next();
  }
  if (authorization) {
    try {
      const token = authorization.replace('Bearer ', '');
      const decodedToken = jwt.verify(token, jwtSecret);
      req.currentUser = decodedToken.user;
    } catch (e) {
      return next();
    }
  }
  return next();
}
