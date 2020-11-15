import { authReducer } from './reducer';
import { getToken } from '../../../test/jwt-mock';
import { failAction, loadingAction, savaTokenAction, logoutAction } from './actions';
import { jwtUtil } from '../../../util/jwt';
import { AuthState } from './types';
import { authState } from '../../../test/state-mock';

it('deve loadingAction', () => {
  expect.assertions(3);

  const action = loadingAction();

  const initial = authReducer(undefined, action);
  const fail = authReducer(authState.fail, action);
  const deslogado = authReducer(authState.deslogado, action);

  const expected: AuthState = {
    loading: true,
    logado: false,
    error: false,
    message: '',
    jwt: null,
    token: null
  };

  expect(initial).toStrictEqual(expected);
  expect(fail).toStrictEqual(expected);
  expect(deslogado).toStrictEqual(expected);
});

it('deve failAction', () => {
  expect.assertions(2);

  const action = failAction('foo');

  const initial = authReducer(undefined, action);
  const loading = authReducer(authState.loading, action);

  const expected: AuthState = {
    loading: false,
    logado: false,
    error: true,
    message: 'foo',
    jwt: null,
    token: null
  };

  expect(initial).toStrictEqual(expected);
  expect(loading).toStrictEqual(expected);
});

it('deve logoutAction', () => {
  expect.assertions(2);

  const action = logoutAction();
  const initial = authReducer(undefined, action);
  const logado = authReducer(authState.logado, action);

  const expected: AuthState = {
    loading: false,
    logado: false,
    error: false,
    message: '',
    jwt: null,
    token: null
  };

  expect(initial).toStrictEqual(expected);
  expect(logado).toStrictEqual(expected);
});

it('deve savaTokenAction', () => {
  expect.assertions(2);

  const token = getToken(60);
  const jwt = jwtUtil.decode(token);

  if (!jwt) {
    return;
  }

  const action = savaTokenAction(token, jwt);

  const initial = authReducer(undefined, action);
  const loading = authReducer(authState.loading, action);

  const expected: AuthState = {
    loading: false,
    logado: true,
    error: false,
    message: '',
    jwt: {
      id: expect.any(Number),
      nome: expect.any(String),
      papel: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number)
    },
    token: expect.any(String)
  };

  expect(initial).toStrictEqual(expected);
  expect(loading).toStrictEqual(expected);
});
