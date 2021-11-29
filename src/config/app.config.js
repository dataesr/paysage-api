const production = {
  jwtSecret: process.env.JWT_SECRET,
  systemName: 'paysage',
  accessTokenExpiresIn: '1h',
  refreshTokenExpiresIn: '20d',
  codesExpiresIn: 900,
  database: {
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DBNAME: 'paysage',
  },
  mailer: {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PWD,
    },
  },
  logger: {
    LOG_LEVEL: 'error',
  },
};

const staging = {
  ...production,
};
const testing = {
  ...production,
  jwtSecret: 'VerYvErySecrREt',
  database: {
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DBNAME: 'paysage-test',
  },
  logger: {
    LOG_LEVEL: 'debug',
  },
  mailer: {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'jacinto.mills25@ethereal.email',
      pass: '4Z7pp6Nz4sGHRNZy31',
    },
  },
};
const development = {
  ...production,
  jwtSecret: 'VerYvErySecrREt',
  database: {
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DBNAME: 'paysage-dev',
  },
  logger: {
    LOG_LEVEL: 'debug',
  },
  mailer: {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'jacinto.mills25@ethereal.email',
      pass: '4Z7pp6Nz4sGHRNZy31',
    },
  },
};

const configs = {
  production,
  staging,
  testing,
  development,
};

export default configs[process.env.NODE_ENV];
