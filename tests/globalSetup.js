import 'dotenv/config';
import request from 'supertest';

import app from '../src/api/app';
import mongo from '../src/services/mongo.service';
import Utils from './utils';

const { clearDB, client, db } = mongo;

beforeAll(() => {
  global.superapp = request(app);
  global.utils = new Utils(db);
  global.db = db;
});

afterAll(async () => {
  await clearDB(global.db);
  client.close();
});
