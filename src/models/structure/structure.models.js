import db from '../../database';
import getUniqueId from '../utils/get-unique-id';

async function findAll() {
  return db.collection('structure').find();
}

async function findById(id) {
  return db.collection('structure').findOne({ id }, { projection: { password: 0, _id: 0 } });
}

async function insertOne(data) {
  const id = await getUniqueId();
  console.debug('==== insertOne ==== ', data);
  await db.collection('structure').insertOne({ id, descriptionFr: data.body.descriptionFr });
  return findById(id);
}

export default {
  findAll,
  insertOne,
  findById,
};
