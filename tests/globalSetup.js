import 'dotenv/config';
import request from 'supertest';
import app from '../src/app';
import db from '../src/database';
import setupDatabase from '../src/database-setup';

beforeAll(async () => {
  global.superapp = request(app);
  global.db = db;
  const collections = await db.listCollections().toArray();
  await Promise.all(collections.map(async (collection) => {
    await db.collection(collection.name).deleteMany({});
  }));
  await setupDatabase();
});
