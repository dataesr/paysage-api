import db from '../database';

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
  setCode,
  verifyCode,
  destroyCode,
};
