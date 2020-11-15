import jwtDecode from 'jwt-decode';

export interface JwtPayload {
  exp: number;
  iat: number;
  id: number;
  nome: string;
  papel: string;
}

export const jwtUtil = {
  isExpired: function(JwtPayload: JwtPayload) {
    return JwtPayload.exp >= Date.now() / 1000;
  },
  decode: function(token: string): JwtPayload | null {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      return null;
    }
  }
};
