import 'dotenv/config';
import request from 'supertest';
import app from '../src/api/app';
import db from '../src/services/mongo.service';
import Utils from './utils';

beforeAll(async () => {
  global.superapp = request(app);
  global.utils = new Utils(db);
  global.db = db;
  await global.utils.clearDB();
});
