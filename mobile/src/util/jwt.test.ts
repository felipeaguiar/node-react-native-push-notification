import { jwtUtil, JwtPayload } from './jwt';
import { getToken } from '../test/jwt-mock';

it('deve decodificar o token válido', () => {
  expect.assertions(1);
  const token = getToken(60);

  const jwtPayload = jwtUtil.decode(token);

  expect(jwtPayload).toStrictEqual({
    id: 1,
    nome: 'Felipe Aguiar',
    papel: 'usuario',
    iat: expect.any(Number),
    exp: expect.any(Number)
  });
});

it('deve retornar null ao detectar token inválido', () => {
  expect.assertions(1);
  const jwtPayload = jwtUtil.decode('foo');

  expect(jwtPayload).toBeNull();
});

it('deve validar se um token não está expirado', () => {
  expect.assertions(1);
  const token = getToken(60);

  const jwtPayload = jwtUtil.decode(token) as JwtPayload;
  const result = jwtUtil.isExpired(jwtPayload);

  expect(result).toBe(true);
});

it('deve validar se um token está expirado', () => {
  expect.assertions(1);
  const token = getToken(0);

  const jwtPayload = jwtUtil.decode(token) as JwtPayload;
  const result = jwtUtil.isExpired(jwtPayload);

  expect(result).toBe(false);
});
