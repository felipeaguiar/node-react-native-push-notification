import jwt from 'jsonwebtoken';

export function getToken(expiresIn: number): string {
  return jwt.sign({
    id: 1,
    nome: 'Felipe Aguiar',
    papel: 'usuario'
  }, 'SECRET', { expiresIn });
}
