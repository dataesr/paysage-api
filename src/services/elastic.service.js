import { Client } from '@elastic/elasticsearch';
import config from '../config/app.config';

const { node, username, password } = config.elastic;

const elastic = new Client({ node, auth: { username, password } });

export default elastic;
