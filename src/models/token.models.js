import db from '../database';

async function setToken({ userId, userAgent, refreshToken, expireAt }) {
  await db.collection('tokens').updateOne(
    { userId, userAgent },
    { $set: { userId, userAgent, refreshToken, expireAt } },
    { upsert: true },
  );
  return db.collection('tokens').findOne({ userId, userAgent });
}

async function destroyToken({ userId, userAgent }) {
  return db.collection('tokens').deleteOne({ userId, userAgent });
}

async function findToken({ userId, userAgent, refreshToken }) {
  return db.collection('tokens').findOne({ userId, userAgent, refreshToken });
}

export default {
  setToken,
  destroyToken,
  findToken,
};
