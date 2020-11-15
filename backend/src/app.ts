import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mustacheExpress from 'mustache-express';
import path from 'path';
import routes from './routes';
import handler from './middleware/handler';
import logger from './config/logger';
import moment from 'moment';

const app = express();

app.use(cors({
  exposedHeaders: [
    'X-Count'
  ]
}));

morgan.token('date', () => moment().format());
app.use(morgan('combined', { stream: { write: message => logger.info(message) } }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.use(handler);

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/view'));

export default app;
