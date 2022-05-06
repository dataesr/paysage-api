import Context from 'swift/context';
import config from '../config';

const { creds } = config.objectStorage;
const swift = process.env.NODE_ENV !== 'testing' ? await Context.build(creds) : {};

export default swift;
