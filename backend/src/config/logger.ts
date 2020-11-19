import winston from 'winston';
import WinstonMysql from 'winston-mysql';

const options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  table: process.env.DB_LOG_TABLE
};

const logger = new winston.Logger({
  level: 'info',
  transports: [
    new WinstonMysql(options)
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(winston.transports.Console);
}

export default logger;
