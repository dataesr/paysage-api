export default async function setupDatabase(db) {
  await db.collection('structures').createIndex({ id: 1 }, { unique: true });
  await db.collection('categories').createIndex({ id: 1 }, { unique: true });
}
