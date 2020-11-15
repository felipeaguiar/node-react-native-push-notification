
export interface Usuario {
  id: number;
  nome?: string;
}

export interface Grupo {
  id: number;
  nome: string;
  usuarios?: Usuario[];
}
