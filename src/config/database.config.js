export default async function setupDatabase(db) {
  await db.collection('assets').createIndex({ id: 1 }, { unique: true });
  await db.collection('categories').createIndex({ id: 1 }, { unique: true });
  await db.collection('documents').createIndex({ id: 1 }, { unique: true });
  await db.collection('legalcategories').createIndex({ id: 1 }, { unique: true });
  await db.collection('news').createIndex({ id: 1 }, { unique: true });
  await db.collection('officialdocuments').createIndex({ id: 1 }, { unique: true });
  await db.collection('persons').createIndex({ id: 1 }, { unique: true });
  await db.collection('prices').createIndex({ id: 1 }, { unique: true });
  await db.collection('strctures').createIndex({ id: 1 }, { unique: true });
  await db.collection('terms').createIndex({ id: 1 }, { unique: true });
}
