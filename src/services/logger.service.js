import winston from 'winston';
import config from '../config/app.config';

const { combine, printf, colorize, timestamp, errors } = winston.format;
const { Console } = winston.transports;

const { logLevel } = config.logger;

const format = combine(
  colorize({ all: true }),
  timestamp({ format: 'YY-MM-DD HH:MM:SS' }),
  printf((info) => {
    const { level, message, timestamp: ts, service, stack } = info;
    if (stack) { return ` [${ts}][${service}][${level}]: ${message}\n${stack}`; }
    return ` [${ts}][${service}][${level}]: ${message}`;
  }),
);

export default winston.createLogger({
  level: logLevel,
  format: errors({ stack: true }),
  transports: [new Console({ format })],
  defaultMeta: { service: process.env.ENTRYPOINT.toUpperCase() },
});
