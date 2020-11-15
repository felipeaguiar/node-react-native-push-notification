import axios from 'axios';

import { logoutAction } from './store/ducks/auth/actions';
import store from './store';
import { env } from './env';

const api = axios.create({
  baseURL: env.url
});

api.interceptors.request.use((config) => {
  try {
    if ( config.url && !config.url.endsWith('login') && !config.url.endsWith('register')) {

      const state = store.getState();

      if (state.auth.token) {
        config.headers['X-Token'] = state.auth.token;
      }

    }
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

api.interceptors.response.use((response) => response, (error) => {
  if (error.message === 'Network Error') {
    //toast.error('Não foi possível conectar-se ao servidor. Verifique sua conexão com a internet.');
  }

  if (error?.response?.status === 401) {
    store.dispatch(logoutAction());
  }

  return Promise.reject(error);
});

export function isApiError(error) {
  return error.isAxiosError && error?.response?.data?.error;
}

export function getMessage(error): string {
  return error.response.data.error.message;
}

export default api;
