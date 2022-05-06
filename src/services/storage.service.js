import Context from 'swift/context';
import config from '../config';

const { creds } = config.objectStorage;
const swift = await Context.build(creds);

export default swift;
