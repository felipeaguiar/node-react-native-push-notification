import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Usuario } from '../model/usuario';
import auth from '../middleware/auth';

const usuarioController = Router();
usuarioController.use(auth);

usuarioController.get('/:id', asyncHandler(async (request: Request, response: Response) => {
  const usuario = await Usuario.findOneOrFail(request.params.id);
  response.send(usuario);
}));

export default usuarioController;
