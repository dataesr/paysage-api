import { Client } from '@elastic/elasticsearch';
import config from '../config';

const { node, username, password } = config.elastic;

const esConfig = { node };
if (username && password) {
  esConfig.auth = { username, password };
}

const esClient = new Client(esConfig);

export default esClient;
