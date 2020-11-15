import { Response, Request, NextFunction } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';

export default function auth(request: Request, response: Response, next: NextFunction) {
  try {
    const token = request.headers['x-token'] as string;

    if (!token) {
      return next(createError(401, 'Token não informado.'));
    }

    if (!process.env.AUTH_SECRET) {
      throw new Error('Secret não configurado');
    }

    jwt.verify(token, process.env.AUTH_SECRET, (erro, decoded: any) => {
      if (erro) {
        next(createError(401, 'Token inválido.'));
      }

      response.locals.userId = decoded.id;
      response.locals.role = decoded.papel;

      return next();
    });
  } catch (error) {
    next(error);
  }

}
