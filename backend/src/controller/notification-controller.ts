import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import auth from '../middleware/auth';
import onesignal from '../config/onesignal';
import { Grupo } from '../model/grupo';
import role from '../middleware/role';

const notificationController = Router();
notificationController.use(auth);

notificationController.post('/:id', role(['admin']), asyncHandler(async (request: Request, response: Response) => {
  const grupo = await Grupo.findOneOrFail(request.params.id);

  grupo.usuarios = grupo.usuarios || [];

  const usuarios = grupo.usuarios
    .filter(u => u.playerId)
    .map(u => u.playerId);

  if (usuarios.length) {
    // TODO Melhorar o corpo da chamada
    await onesignal.post('notifications', { include_player_ids: usuarios, ...request.body });
  }

  response.status(200).send();
}));

export default notificationController;
