import 'reflect-metadata';
import 'dotenv/config';
import { createConnection } from 'typeorm';
import path from 'path';
import app from './app';
import logger from './config/logger';

global.rootPath = path.resolve(__dirname);

createConnection()
  .then(async connection => {

    const port = process.env.APP_PORT;
    app.listen(port);

    logger.info('Servidor iniciado');

    return connection;
  })
  .catch(error => console.log(error));
