import 'dotenv/config';

import createAPIServer from './src/api';

const { PORT } = process.env;

createAPIServer(PORT || 3000);
