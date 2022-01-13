import 'dotenv/config';
import request from 'supertest';
import app from '../src/app';
import db from '../src/modules/commons/services/database.service';
import setupDatabase from '../src/config/database.config';
import Utils from './utils';

beforeAll(async () => {
  global.superapp = request(app);
  global.utils = new Utils(db);
  global.db = db;
  await global.utils.clearDB();
  await setupDatabase();
});
