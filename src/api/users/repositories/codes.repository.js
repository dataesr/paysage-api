import db from '../../../services/mongo.service';

async function replace(data) {
  await db.collection('codes').updateOne(
    { userId, type },
    { $set: data },
    { upsert: true },
  );
  return db.collection('code').findOne({ userId, type, code });
}

async function find(filters) {
  return db.collection('codes').findOne(filters);
}
async function remove(filters) {
  return db.collection('codes').deleteOne(filters);
}

export default {
  setCode,
  findCode,
  deleteCode,
};
