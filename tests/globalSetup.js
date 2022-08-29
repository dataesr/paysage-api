import 'dotenv/config';
import request from 'supertest';

import app from '../src/api/app';
import { clearDB, client, db } from '../src/services/mongo.service';
import esClient from '../src/services/elastic.service';
import Utils from './utils';
import agenda from '../src/jobs/agenda';

beforeAll(() => {
  global.superapp = request(app);
  global.utils = new Utils(db);
  global.db = db;
});

afterAll(async () => {
  if (global && global.db) {
    await clearDB(global.db);
  }
  if (client) {
    await client.close();
  }
  if (esClient) {
    await esClient.close();
  }
  await agenda.stop();
});
