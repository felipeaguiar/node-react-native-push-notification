import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

export default function role(roles: string[]) {
  return function(request: Request, response: Response, next: NextFunction) {
    const role = response.locals.role;

    if (roles.indexOf(role) > -1) {
      next();
    } else {
      next(createError(403, 'Recurso não autorizado.'));
    }
  };
}
