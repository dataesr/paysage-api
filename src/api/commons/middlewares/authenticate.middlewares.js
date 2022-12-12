import jwt from 'jsonwebtoken';
import { apiKeysRepository } from '../repositories';
import config from '../../../config';

const { jwtSecret } = config;

export async function authenticate(req, res, next) {
  const { authorization, 'x-api-key': xApiKey } = req.headers;
  req.currentUser = {};
  if (xApiKey) {
    console.log('HEREEEEEEE');
    const apiKey = await apiKeysRepository.find({ filters: { apiKey: xApiKey } });
    if (apiKey.userId) req.currentUser = { id: apiKey.userId, role: apiKey.role };
    return next();
  }
  if (authorization) {
    console.log('TTTTTTTHEREEEEEEE');
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
