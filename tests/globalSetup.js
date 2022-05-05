import 'dotenv/config';
import request from 'supertest';

import app from '../src/api/app';
import db, { client } from '../src/services/mongo.service';
import Utils from './utils';

beforeAll(() => {
  global.superapp = request(app);
  global.utils = new Utils(db);
  global.db = db;
});

afterAll(async () => {
  await global.utils.clearDB();
  client.close();
});
