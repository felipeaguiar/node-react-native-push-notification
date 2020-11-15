import { AuthMessagesType, LoadMessageAction, DefaultMessageAction, FailMessageAction } from './types';
import { JwtPayload } from '../../../util/jwt';

export function failAction(message: string): FailMessageAction {
  return { type: AuthMessagesType.FAIL, message };
}

export function loadingAction(): DefaultMessageAction {
  return { type: AuthMessagesType.LOADING };
}

export function logoutAction(): DefaultMessageAction {
  return { type: AuthMessagesType.LOGOUT };
}

export function savaTokenAction(token: string, jwtPayload: JwtPayload): LoadMessageAction {
  return { type: AuthMessagesType.SAVE_TOKEN, token, jwtPayload };
}
