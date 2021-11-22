import db from '../../database';
import getUniqueId from '../utils/get-unique-id';

async function findAll(id) {
  return db.collection('structure').findOne({ id });
}

async function findById(id) {
  return db.collection('structure').findOne({ id }, { projection: { password: 0, _id: 0 } });
}

async function insertOne(id, data) {
  const newId = await getUniqueId();
  console.log('==== LOG ==== ', newId);
  await db.collection('structure').insertOne({ id, ...data });
  return findById(id);
}

async function updateById(id, data) {
  await db.collection('structure').updateOne({ id }, { $set: data });
  return findById(id);
}

async function deleteById(id) {
  await db.collection('structure').findOneAndDelete({ id });
  return null;
}

export default {
  findById,
  findAll,
  insertOne,
  updateById,
  deleteById,
};
