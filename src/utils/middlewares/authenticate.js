import jwt from 'jsonwebtoken';

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  req.currentUser = {};
  try {
    const token = authorization.replace('Bearer ', '');
    req.currentUser = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return next();
  }
  return next();
};
export default authenticate;
