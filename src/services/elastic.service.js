import { Client } from '@elastic/elasticsearch';

import config from '../config';

const { node, password, username } = config.elastic;

const esConfig = { node };
if (password && username) {
  esConfig.auth = { username, password };
}

const esClient = new Client(esConfig);

export default esClient;
