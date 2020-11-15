import { AuthState, AuthMessageAction, AuthMessagesType, FailMessageAction, LoadMessageAction } from './types';

export const initialState: AuthState = {
  loading: true,
  logado: false,
  error: false,
  message: '',
  jwt: null,
  token: null
};

export function authReducer(state = initialState, messageAction: AuthMessageAction): AuthState {
  let action;

  switch (messageAction.type) {
    case AuthMessagesType.LOADING:
      return {
        ...state,
        error: false,
        message: '',
        loading: true
      };
    case AuthMessagesType.FAIL:
      action = messageAction as FailMessageAction;

      return {
        ...state,
        loading: false,
        error: true,
        message: action.message,
        token: null,
        jwt: null
      };
    case AuthMessagesType.SAVE_TOKEN:
      action = messageAction as LoadMessageAction;

      return {
        ...state,
        loading: false,
        logado: true,
        token: action.token,
        jwt: action.jwtPayload
      };
    case AuthMessagesType.LOGOUT:
      return {
        ...state,
        loading: false,
        logado: false,
        token: null,
        jwt: null
      };
    default:
      return state;
  }
}
