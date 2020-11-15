import jwtDecode from 'jwt-decode';
import db from '../test/db';
import request from 'supertest';
import app from '../app';

beforeAll(async () => {
  await db.create('auth');
});

afterAll(async () => {
  await db.close();
});

it('deve cadastrar usuário com sucesso', async () => {
  expect.assertions(3);

  const response = await request(app)
    .post('/auth/register')
    .send({
      nome: 'Felipe Aguiar',
      email: 'felipe@mail.com',
      senha: '123456'
    });

  expect(response.status).toBe(200);

  expect(response.body).toStrictEqual({
    token: expect.any(String),
    usuario: {
      id: expect.any(Number),
      version: expect.any(Number),
      nome: 'Felipe Aguiar',
      papel: 'usuario',
      email: 'felipe@mail.com'
    }
  });

  const dump = await db.dump();
  expect(dump).toMatchSnapshot();
});

it('deve validar se o usuário está tentando cadastrar um usuário já existente', async () => {
  expect.assertions(2);

  const response = await request(app)
    .post('/auth/register')
    .send({
      nome: 'Felipe Aguiar',
      email: 'felipe@mail.com',
      senha: '123456'
    });

  expect(response.status).toBe(400);

  expect(response.body).toStrictEqual({
    status: 400,
    error: expect.objectContaining({
      message: expect.any(String)
    })
  });
});

it('deve falhar ao tentar cadastrar um usuário com dados inválidos', async () => {
  expect.assertions(3);

  const response = await request(app)
    .post('/auth/register')
    .send({
      nome: 'Fel',
      email: 'mail.com',
      senha: '1234'
    });

  expect(response.status).toBe(400);

  expect(response.body).toStrictEqual({
    status: 400,
    error: expect.arrayContaining([
      expect.objectContaining({
        message: expect.any(String),
        context: expect.objectContaining({ key: 'nome' })
      }),
      expect.objectContaining({
        message: expect.any(String),
        context: expect.objectContaining({ key: 'email' })
      }),
      expect.objectContaining({
        message: expect.any(String),
        context: expect.objectContaining({ key: 'senha' })
      })
    ])
  });

  expect(response.body.error).toHaveLength(3);
});

it('deve autenticar um usuário e receber o token de acesso válido', async () => {
  expect.assertions(3);

  const response = await request(app)
    .post('/auth/login')
    .send({
      email: 'felipe@mail.com',
      senha: '123456'
    });

  expect(response.status).toBe(200);

  expect(response.body).toStrictEqual({
    usuario: {
      id: expect.any(Number),
      version: expect.any(Number),
      nome: 'Felipe Aguiar',
      email: 'felipe@mail.com',
      papel: 'usuario'
    },
    token: expect.any(String)
  });

  const token = jwtDecode(response.body.token);

  expect(token).toStrictEqual({
    id: expect.any(Number),
    nome: expect.any(String),
    papel: expect.any(String),
    iat: expect.any(Number),
    exp: expect.any(Number)
  });
});

it('deve falhar ao tentar autenticar com email e senha inválidos', async () => {
  expect.assertions(2);

  const response = await request(app)
    .post('/auth/login')
    .send({
      email: 'mail.com',
      senha: '1234'
    });

  expect(response.status).toBe(400);

  expect(response.body).toStrictEqual({
    status: 400,
    error: expect.arrayContaining([
      expect.objectContaining({
        message: expect.any(String),
        context: expect.objectContaining({ key: 'email' })
      }),
      expect.objectContaining({
        message: expect.any(String),
        context: expect.objectContaining({ key: 'senha' })
      })
    ])
  });
});

it('deve falhar ao tentar autenticar com uma senha incorreta', async () => {
  expect.assertions(2);

  const response = await request(app)
    .post('/auth/login')
    .send({
      email: 'felipe@mail.com',
      senha: '654321'
    });

  expect(response.status).toBe(400);

  expect(response.body).toStrictEqual({
    status: 400,
    error: expect.objectContaining({
      message: expect.any(String)
    })
  });
});
