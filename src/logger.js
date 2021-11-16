import winston from 'winston';
import config from './config';

const { LOG_LEVEL } = config.logger;

const alignColorsAndTime = winston.format.combine(
  winston.format.colorize({
    all: true,
  }),
  winston.format.timestamp({
    format: 'YY-MM-DD HH:MM:SS',
  }),
  winston.format.printf(
    (info) => ` [${info.timestamp}][${info.level}]: ${info.message}`,
  ),
);

export default winston.createLogger({
  level: LOG_LEVEL,
  transports: [
    new (winston.transports.Console)({
      format: winston.format.combine(winston.format.colorize(), alignColorsAndTime),
    }),
  ],
});
