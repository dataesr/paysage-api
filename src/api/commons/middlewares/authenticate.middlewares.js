import jwt from 'jsonwebtoken';
import config from '../../../config';

const { jwtSecret } = config;

export async function authenticate(req, res, next) {
  const { authorization } = req.headers;
  req.currentUser = {};
  try {
    const token = authorization.replace('Bearer ', '');
    const decodedToken = jwt.verify(token, jwtSecret);
    req.currentUser = decodedToken.user;
  } catch (e) {
    return next();
  }
  return next();
}
