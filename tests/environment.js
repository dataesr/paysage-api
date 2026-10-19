import 'dotenv/config';
// eslint-disable-next-line import/no-extraneous-dependencies
import NodeEnvironment from 'jest-environment-node';

import app from '../src/api/app';
import agenda from '../src/jobs';
import esClient from '../src/services/elastic.service';
import { clearDB, client, db } from '../src/services/mongo.service';

// Jest evaluates each test file's modules in a new context, and Node never frees ES modules evaluated
// that way: importing the app from the test files kept a full copy of it per file (~60 MB).
// Imported here, the app is loaded once by Node's own loader and shared by all test files.
// Test files use these instances through global.*: importing them would load a second copy.
export default class AppEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    Object.assign(this.global, { app, agenda, clearDB, client, db, esClient });
  }
}
