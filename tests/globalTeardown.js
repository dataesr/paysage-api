import agenda from '../src/jobs';
import esClient from '../src/services/elastic.service';
import { client } from '../src/services/mongo.service';

// With --runInBand, these are the instances loaded by tests/environment.js: close them once, after all test files.
export default async () => {
  await agenda.stop();
  await client.close();
  await esClient.close();
};
