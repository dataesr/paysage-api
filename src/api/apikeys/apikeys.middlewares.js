import crypto from 'crypto';

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.repeat(5);

export function setApiKeyInContext(req, res, next) {
  const rand = crypto.randomBytes(20);
  let str = '';

  for (let i = 0; i < rand.length; i += 1) {
    const decimal = rand[i];
    str += CHARS[decimal];
  }
  req.context.apiKey = `xkeypsg-${str}`;
  return next();
}

export function setUserIdInContext(req, res, next) {
  if (req?.body?.userId) return next();
  const { id } = req.currentUser;
  req.context.userId = id;
  return next();
}
