import { JwtPayload } from '../../../util/jwt';

/* MessagesType */
export enum AuthMessagesType {
  LOADING = 'AUTH_LOADING',
  FAIL = 'AUTH_FAIL',
  SAVE_TOKEN = 'AUTH_SAVE_TOKEN',
  LOGOUT = 'AUTH_LOGOUT'
}

/* State */
export interface AuthState {
  readonly loading: boolean;
  readonly logado: boolean;
  readonly error: boolean;
  readonly message: string;
  readonly jwt: JwtPayload | null;
  readonly token: string | null;
}

/* MessageAction */
export interface DefaultMessageAction {
  type: AuthMessagesType;
}

export interface LoginMessageAction {
  type: AuthMessagesType;
  login: {
    email: string;
    senha: string;
  };
}

export interface LoadMessageAction {
  type: AuthMessagesType;
  token: string;
  jwtPayload?: any;
}

export interface FailMessageAction {
  type: AuthMessagesType;
  message: string;
}

export type AuthMessageAction = DefaultMessageAction | LoginMessageAction | LoadMessageAction | FailMessageAction;

/* Actions */
export interface LoginAction {
  email: string;
  senha: string;
}
