import { RootState } from '../..';

export function isLoading(state: RootState): boolean {
  return state.auth.loading;
}

export function isLogado(state: RootState): boolean {
  return state.auth.logado;
}

export function hasLoginError(state: RootState): boolean {
  return state.auth.error;
}

export function getLoginErrorMessage(state: RootState): string {
  return state.auth.message;
}
