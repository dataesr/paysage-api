const production = {
  jwtSecret: process.env.JWT_SECRET,
  systemName: 'paysage',
  database: {
    mongoUri: process.env.MONGO_URI,
    mongoDbName: 'paysage',
  },
  logger: {
    logLevel: 'error',
  },
  hostname: 'https://api.paysage.dataesr.ovh',
};

const staging = {
  ...production,
};
const testing = {
  ...production,
  jwtSecret: 'VerYvErySecrREt',
  database: {
    ...production.database,
    mongoDbName: 'paysage-test1',
  },
  logger: {
    logLevel: 'debug',
  },
  hostname: 'https://api.paysage.staging.dataesr.ovh',
};
const development = {
  ...production,
  jwtSecret: 'VerYvErySecrREt',
  database: {
    ...production.database,
    mongoDbName: 'paysage-dev',
  },
  logger: {
    logLevel: 'debug',
  },
  hostname: 'http://localhost:3000',
};

const configs = {
  production,
  staging,
  testing,
  development,
};

export default configs[process.env.NODE_ENV];
