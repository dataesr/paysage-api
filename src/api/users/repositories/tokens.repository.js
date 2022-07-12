import db from '../../../services/mongo.service';

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

export default {
  setToken,
  deleteToken,
  findToken,
};
