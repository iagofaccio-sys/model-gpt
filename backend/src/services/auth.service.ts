import { Role } from "@prisma/client";
import { AppError } from "../utils/appError";
import { comparePassword, hashPassword } from "../utils/password";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { userRepository } from "../repositories/user.repository";
import { refreshTokenRepository } from "../repositories/refreshToken.repository";

type SignupInput = {
  name: string;
  email: string;
  password: string;
  role: Role;
  baseId?: string;
  supervisorId?: string;
};

type LoginInput = {
  email: string;
  password: string;
};

function calculateRefreshTokenExpiry(): Date {
  const now = new Date();
  now.setDate(now.getDate() + 7);
  return now;
}

export const authService = {
  async signup(data: SignupInput) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError("E-mail já cadastrado.", 409);
    }

    const passwordHash = await hashPassword(data.password);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
      baseId: data.baseId,
      supervisorId: data.supervisorId,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },

  async login(data: LoginInput) {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError("Credenciais inválidas.", 401);
    }

    if (!user.isActive) {
      throw new AppError("Usuário inativo.", 403);
    }

    const passwordMatches = await comparePassword(
      data.password,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new AppError("Credenciais inválidas.", 401);
    }

    const accessToken = signAccessToken({
      sub: user.id,
      role: user.role,
      email: user.email,
    });

    const refreshToken = signRefreshToken({
      sub: user.id,
    });

    await refreshTokenRepository.create(
      refreshToken,
      user.id,
      calculateRefreshTokenExpiry()
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  },

  async logout(refreshToken: string) {
    if (!refreshToken) {
      return;
    }

    await refreshTokenRepository.revokeByToken(refreshToken);
  },

  async refreshToken(oldRefreshToken: string) {
    if (!oldRefreshToken) {
      throw new AppError("Refresh token não enviado.", 401);
    }

    verifyRefreshToken(oldRefreshToken);

    const storedToken =
      await refreshTokenRepository.findByToken(oldRefreshToken);

    if (!storedToken) {
      throw new AppError("Refresh token inválido.", 401);
    }

    if (storedToken.revokedAt) {
      throw new AppError("Refresh token revogado.", 401);
    }

    if (storedToken.expiresAt < new Date()) {
      throw new AppError("Refresh token expirado.", 401);
    }

    const user = storedToken.user;

    const newAccessToken = signAccessToken({
      sub: user.id,
      role: user.role,
      email: user.email,
    });

    const newRefreshToken = signRefreshToken({
      sub: user.id,
    });

    await refreshTokenRepository.revokeByToken(oldRefreshToken);

    await refreshTokenRepository.create(
      newRefreshToken,
      user.id,
      calculateRefreshTokenExpiry()
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return {
        message:
          "Se o e-mail existir, um processo de redefinição foi iniciado.",
      };
    }

    const resetToken = signAccessToken({
      sub: user.id,
      role: user.role,
      email: user.email,
    });

    return {
      message:
        "Token de redefinição gerado para ambiente de teste.",
      resetToken,
    };
  },

  async resetPassword(token: string, newPassword: string) {
    if (!token) {
      throw new AppError("Token de redefinição não enviado.", 400);
    }

    const payload = verifyAccessToken(token);

    const user = await userRepository.findById(payload.sub);

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    const passwordHash = await hashPassword(newPassword);

    await userRepository.updatePassword(user.id, passwordHash);
    await refreshTokenRepository.revokeAllByUserId(user.id);

    return {
      message: "Senha redefinida com sucesso.",
    };
  },
};