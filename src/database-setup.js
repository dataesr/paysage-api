import db from './database';

export default async function setupDatabase() {
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ username: 1 }, { unique: true });
  await db.collection('users').createIndex({ id: 1 }, { unique: true });
  await db.collection('tokens').createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection('tokens').createIndex({ token: 1, userAgent: 1 });
  await db.collection('codes').createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection('codes').createIndex({ userId: 1, code: 1, type: 1 });

  // TODO: Add validation at the database level here ?
}
