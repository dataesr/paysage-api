import db from '../database';
import getUniqueId from './utils/get-unique-id';

async function findById(id) {
  return db.collection('users').findOne({ id }, { projection: { password: 0, _id: 0 } });
}

async function findByAccount(account) {
  return db.collection('users').findOne(
    { $or: [{ email: account }, { username: account }] },
    { projection: { password: 0, _id: 0 } },
  );
}

async function getPasswordByAccount(account) {
  const user = await db.collection('users').findOne(
    { $or: [{ email: account }, { username: account }] },
    { projection: { password: 1, _id: 0 } },
  );
  return user ? user.password : null;
}

async function setPassword(userId, password) {
  await db.collection('users').updateOne(
    { id: userId },
    { $set: { password } },
  );
  return findById(userId);
}

async function insertOne(data) {
  const id = await getUniqueId();
  await db.collection('users').insertOne({ id, ...data });
  return findById(id);
}

async function updateById(id, data) {
  await db.collection('users').updateOne({ id }, { $set: data });
  return findById(id);
}

async function deleteById(id) {
  await db.collection('users').findOneAndDelete({ id });
  return null;
}

async function setToken({ userId, userAgent, refreshToken, expireAt }) {
  await db.collection('tokens').updateOne(
    { userId, userAgent },
    { $set: { userId, userAgent, refreshToken, expireAt } },
    { upsert: true },
  );
  return db.collection('tokens').findOne({ userId, userAgent });
}

async function deleteToken({ userId, userAgent }) {
  return db.collection('tokens').deleteOne({ userId, userAgent });
}

async function findToken({ userId, userAgent, refreshToken }) {
  return db.collection('tokens').findOne({ userId, userAgent, refreshToken });
}

async function setCode({ userId, type, code, expireAt }) {
  await db.collection('codes').updateOne(
    { userId, type },
    { $set: { userId, type, code, expireAt } },
    { upsert: true },
  );
  return db.collection('code').findOne({ userId, type, code });
}

async function verifyCode({ userId, type, code }) {
  return db.collection('codes').findOne({ userId, type, code });
}
async function destroyCode({ userId, type, code }) {
  return db.collection('codes').deleteOne({ userId, type, code });
}

export default {
  findById,
  findByAccount,
  getPasswordByAccount,
  setPassword,
  insertOne,
  updateById,
  deleteById,
  setToken,
  deleteToken,
  findToken,
  setCode,
  verifyCode,
  destroyCode,
};
