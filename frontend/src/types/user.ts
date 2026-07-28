export type UserRole = 'GERENTE' | 'SUPERVISOR' | 'VENDEDOR' | 'OPERADOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}