import Context from 'swift/context';

import config from '../config';

const { credentials } = config.objectStorage;
const swift = process.env.NODE_ENV !== 'testing' ? await Context.build(credentials) : {};

export default swift;
