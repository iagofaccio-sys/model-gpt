import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  email: z.email("E-mail inválido.").toLowerCase(),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
  role: z.enum(["OPERADOR", "VENDEDOR", "SUPERVISOR", "GERENTE"]),
  baseId: z.string().optional(),
  supervisorId: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email("E-mail inválido.").toLowerCase(),
  password: z.string().min(1, "Senha é obrigatória."),
});

export const forgotPasswordSchema = z.object({
  email: z.email("E-mail inválido.").toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token é obrigatório."),
  newPassword: z.string().min(6, "Nova senha deve ter pelo menos 6 caracteres."),
});