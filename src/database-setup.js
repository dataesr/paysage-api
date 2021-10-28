import db from './database';

export default async function setupDatabase() {
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ username: 1 }, { unique: true });
  await db.collection('users').createIndex({ id: 1 }, { unique: true });
}
