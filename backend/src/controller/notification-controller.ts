import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import auth from '../middleware/auth';
import onesignal from '../config/onesignal';
import { Grupo } from '../model/grupo';
import role from '../middleware/role';

const notificationController = Router();
notificationController.use(auth);

const appId = '4be43d8f-7f07-4c37-a20f-f44a1fa5d354';

notificationController.post('/:id', role(['admin']), asyncHandler(async (request: Request, response: Response) => {
  const grupo = await Grupo.findOneOrFail(request.params.id);

  grupo.usuarios = grupo.usuarios || [];

  const usuarios = grupo.usuarios
    .filter(u => u.playerId)
    .map(u => u.playerId);

  if (usuarios.length) {
    for (let i = 0; i < usuarios.length; i += 2000) {
      const ids = usuarios.slice(i, i + 2000);

      await onesignal.post('notifications', {
        include_player_ids: ids,
        app_id: appId,
        headings: { en: request.body.titulo },
        contents: { en: request.body.mensagem }
      });

    }
  }

  response.status(200).send();
}));

export default notificationController;
