export default {
  jwtSecret: 'VerYvErySecrREt',
  systemName: 'paysage',
  accessTokenExpiresIn: '1h',
  refreshTokenExpiresIn: '20d',
  database: {
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DBNAME: 'paysage-test',
  },
  mailer: {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'jacinto.mills25@ethereal.email',
      pass: '4Z7pp6Nz4sGHRNZy31',
    },
  },
  logger: {
    LOG_LEVEL: 'debug',
  },
};
