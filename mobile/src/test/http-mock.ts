import nock from 'nock';
import { getToken } from './jwt-mock';
import { env } from '../env';

export function loginMock(email: string, senha: string) {
  return nock(env.url)
    .post('/auth/login', { email, senha })
    .reply((uri: string, body: any) => {
      if (body.email === 'felipe@mail.com' && body.senha === '123456') {
        return [
          200,
          {
            usuario: {
              id: 1,
              nome: 'Felipe Aguiar',
              email: 'felipe@mail.com',
              papel: 'usuario'
            },
            token: getToken(60)
          },
          { 'Access-Control-Allow-Origin': '*' }
        ];
      } else {
        return [
          400,
          {
            status: 400,
            error: {
              message: 'Usuário ou senha inválidos'
            }
          },
          { 'Access-Control-Allow-Origin': '*' }
        ];
      }
    });
}

export function registerMock() {
  return nock(env.url)
    .post('/auth/register')
    .reply(200, {
      token: getToken(60),
      usuario: {
        id: 1,
        nome: 'Felipe Aguiar',
        papel: 'usuario',
        email: 'felipe@mail.com'
      }
    },
    { 'Access-Control-Allow-Origin': '*' }
    );
}
