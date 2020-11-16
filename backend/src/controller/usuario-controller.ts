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

usuarioController.put('/player-id/:player', asyncHandler(async (request: Request, response: Response) => {
  const usuario = await Usuario.findOneOrFail(response.locals.userId);
  usuario.playerId = request.params.player;
  await usuario.save();
  response.status(200).send();
}));

export default usuarioController;
