import db from '../services/mongo.service';

export default async function setupDatabase() {
  await db.collection('structures').createIndex({ id: 1 }, { unique: true });
  await db.collection('categories').createIndex({ id: 1 }, { unique: true });
}
