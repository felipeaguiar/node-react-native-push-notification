import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { isCelebrate } from 'celebrate';
import { QueryFailedError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { ConcurrencyError } from '../infrastructure/concurrency';
import logger from '../config/logger';

class ResponseMessage {
  status: number;
  error: any;
}

function handleValidationError(error): ResponseMessage {
  const message = new ResponseMessage();

  message.status = 400;
  message.error = error.joi.details;

  return message;
}

function handleHttpError(error): ResponseMessage {
  const message = new ResponseMessage();

  if (!error.expose) {
    logger.error('Erro desconhecido.', { message: error.message, stack: error.stack });
    message.status = 500;
    message.error = { message: 'Erro desconhecido.' };
    return message;
  }

  if (error.status === 404) {
    message.status = 404;
    message.error = { message: 'Recurso não encontrado.' };
    return message;
  }

  message.status = error.status || 500;

  switch (error.type) {
    case 'entity.parse.failed':
      message.error = { message: 'JSON inválido.' };
      break;
    default:
      message.error = { message: error.message };
  }

  return message;
}

function handleDataError(error): ResponseMessage {
  const message = new ResponseMessage();
  message.status = 400;

  switch (error.code) {
    case 'ER_DUP_ENTRY':
      message.error = { message: 'Recurso duplicado.' };
      break;
    default:
      message.error = { message: 'Erro de dados.' };
  }

  return message;
}

export default function handler(error, request: Request, response: Response, next: NextFunction) {
  let message: ResponseMessage;

  if (isCelebrate(error)) {
    message = handleValidationError(error);
  } else if (error instanceof QueryFailedError) {
    message = handleDataError(error);
  } else if (error instanceof EntityNotFoundError) {
    message = {
      status: 404,
      error: { message: 'Recurso não encontrado.' }
    };
  } else if (createError.isHttpError(error)) {
    message = handleHttpError(error);
  } else if (error instanceof ConcurrencyError) {
    message = {
      status: 409,
      error: {
        message: 'Este recurso foi alterado por outro usuário.',
        context: error.entity
      }
    };
  } else {
    logger.error('Erro desconhecido.', { message: error.message, stack: error.stack });
    message = {
      status: 500,
      error: { message: 'Erro desconhecido.' }
    };
  }

  response.status(message.status).send(message);
}
