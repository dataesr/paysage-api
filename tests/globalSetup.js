// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals';
import request from 'supertest';

import Utils from './utils';

jest.setTimeout(60000);

// app, db and the other shared instances are set by tests/environment.js.
beforeAll(() => {
  global.superapp = request(global.app);
  global.utils = new Utils(global.db);
});

afterAll(async () => {
  await global.clearDB(global.db);
});
