import development from './development';
// import staging from './staging';
import production from './production';
import testing from './testing';

const configs = { development, testing, production };

export default configs[process.env.NODE_ENV];
