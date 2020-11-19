import { Router } from 'express';
import createError from 'http-errors';
import authController from './controller/auth-controller';
import grupoController from './controller/grupo-controller';
import usuarioController from './controller/usuario-controller';
import notificationController from './controller/notification-controller';

const routes = Router();

routes.use('/auth', authController);
routes.use('/usuario', usuarioController);
routes.use('/grupo', grupoController);
routes.use('/notification', notificationController);

routes.all('*', (request, response, next) => next(createError(404)));

export default routes;
