export const authState = {
  fail: {
    loading: false,
    logado: false,
    error: true,
    message: 'Usuário ou senha inválidos',
    jwt: null,
    token: null
  },

  logado: {
    loading: false,
    logado: true,
    error: false,
    message: '',
    jwt: {
      id: 1,
      nome: 'Felipe Aguiar',
      papel: 'usuario',
      iat: 1595624163,
      exp: 1595624223
    },
    token: 'foo'
  },

  deslogado: {
    loading: false,
    logado: false,
    error: false,
    message: '',
    jwt: null,
    token: null
  },

  loading: {
    loading: true,
    logado: false,
    error: false,
    message: '',
    jwt: null,
    token: null
  }
};
