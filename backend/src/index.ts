import 'reflect-metadata';
import 'dotenv/config';
import { createConnection } from 'typeorm';
import app from './app';
import logger from './config/logger';

createConnection()
  .then(async connection => {

    const port = process.env.APP_PORT || 8000;
    app.listen(port);

    logger.info('Servidor iniciado');
    return connection;
  })
  .catch(error => console.log(error));
