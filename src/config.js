const production = {
  jwtSecret: process.env.JWT_SECRET,
  defaultAccountConfirmation: false,
  totpWindow: [20, 0],
  accessTokenExpiresIn: '1d',
  refreshTokenExpiresIn: '20d',
  otpHeader: 'x-paysage-otp',
  otpMethodHeader: 'x-paysage-otp-method',
  systemName: 'paysage',
  database: {
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
      version: 'v3',
      keystoneAuthVersion: 'v3',
      provider: 'openstack',
      authUrl: process.env.OVH_AUTH_URL,
      username: process.env.OVH_USERNAME,
      password: process.env.OVH_PASSWORD,
      tenantId: process.env.OVH_TENANT_ID,
      tenantName: process.env.OVH_TENANT_NAME,
      domainName: 'Default',
      projectDomainName: 'Default',
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
  defaultAccountConfirmation: true,
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
  defaultAccountConfirmation: true,
  database: {
    ...production.database,
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
  defaultAccountConfirmation: true,
  database: {
    ...production.database,
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
