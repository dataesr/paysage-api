const production = {
  jwtSecret: process.env.JWT_SECRET,
  systemName: 'paysage',
  mongo: {
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017',
    mongoDbName: 'paysage',
  },
  elastic: {
    node: process.env.ES_NODE,
    username: process.env.ES_USERNAME,
    password: process.env.ES_PASSWORD,
    index: 'paysage-prod',
  },
  objectStorage: {
    credentials: {
      authUrl: process.env.OVH_AUTH_URL,
      username: process.env.OVH_USERNAME,
      password: process.env.OVH_PASSWORD,
      tenantId: process.env.OVH_TENANT_ID,
      region: process.env.OVH_REGION,
    },
    container: 'paysage',
  },
  logger: {
    logLevel: 'error',
  },
  hostname: 'https://api.paysage.dataesr.ovh',
};

const staging = {
  ...production,
  objectStorage: {
    ...production.objectStorage,
    container: 'paysage-staging',
  },
  elastic: {
    ...production.elastic,
    index: 'paysage-staging',
  },
  hostname: 'https://api.paysage.staging.dataesr.ovh',
};

const testing = {
  ...production,
  jwtSecret: 'VerYvErySecrREt',
  mongo: {
    ...production.mongo,
    mongoDbName: 'paysage-test',
  },
  elastic: {
    ...production.elastic,
    index: 'paysage-test',
  },
  objectStorage: {
    ...production.objectStorage,
    container: 'paysage-test',
  },
  logger: {
    logLevel: 'error',
  },
};

const development = {
  ...production,
  jwtSecret: 'VerYvErySecrREt',
  mongo: {
    ...production.mongo,
    mongoDbName: 'paysage-dev',
  },
  elastic: {
    ...production.elastic,
    index: 'paysage-dev',
  },
  objectStorage: {
    ...production.objectStorage,
    container: 'paysage-dev',
  },
  logger: {
    logLevel: 'debug',
  },
  hostname: 'http://localhost:3000',
};

const configs = {
  development,
  production,
  staging,
  testing,
};

export default configs[process.env.NODE_ENV];
