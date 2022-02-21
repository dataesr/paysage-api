const production = {
  jwtSecret: process.env.JWT_SECRET,
  systemName: 'paysage',
  database: {
    mongoUri: process.env.MONGO_URI,
    mongoDbName: 'paysage',
  },
  objectStorage: {
    creds: {
      authUrl: process.env.OVH_AUTH_URL,
      username: process.env.OVH_USERNAME,
      password: process.env.OVH_PASSWORD,
      tenantId: process.env.OVH_TENANT_ID,
      region: process.env.OVH_REGION,
    },
    container: 'paysage',
    url: 'https://storage.sbg.cloud.ovh.net/v1/AUTH_32c5d10cb0fe4519b957064a111717e3',
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
};
const testing = {
  ...production,
  jwtSecret: 'VerYvErySecrREt',
  database: {
    ...production.database,
    mongoDbName: 'paysage-test1',
  },
  objectStorage: {
    ...production.objectStorage,
    container: 'paysage-test',
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
  production,
  staging,
  testing,
  development,
};

export default configs[process.env.NODE_ENV];
