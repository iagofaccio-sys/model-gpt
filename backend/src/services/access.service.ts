import { Role } from "@prisma/client";
import { AppError } from "../utils/appError";
import { userRepository } from "../repositories/user.repository";
import { salesCoverageRepository } from "../repositories/salesCoverage.repository";

type CurrentUser = {
  userId: string;
  role: Role;
  email: string;
};

export const accessService = {
  async canAccessUser(currentUser: CurrentUser, targetUserId: string) {
    const targetUser = await userRepository.findById(targetUserId);

    if (!targetUser) {
      throw new AppError("Usuário alvo não encontrado.", 404);
    }

    if (currentUser.role === Role.GERENTE) {
      return {
        allowed: true,
        reason: "GERENTE pode acessar qualquer usuário.",
        targetUser,
      };
    }

    if (currentUser.role === Role.VENDEDOR) {
      if (currentUser.userId === targetUser.id) {
        return {
          allowed: true,
          reason: "VENDEDOR pode acessar os próprios dados.",
          targetUser,
        };
      }

      const activeCoverage = await salesCoverageRepository.findActiveCoverage(
        currentUser.userId,
        targetUser.id
      );

      return {
        allowed: !!activeCoverage,
        reason: activeCoverage
          ? "VENDEDOR pode acessar este usuário por cobertura ativa."
          : "VENDEDOR não pode acessar dados deste usuário.",
        targetUser,
      };
    }

    if (currentUser.role === Role.SUPERVISOR) {
      const currentSupervisor = await userRepository.findById(currentUser.userId);

      if (!currentSupervisor) {
        throw new AppError("Supervisor autenticado não encontrado.", 404);
      }

      if (
        targetUser.role === Role.VENDEDOR &&
        currentSupervisor.baseId &&
        currentSupervisor.baseId === targetUser.baseId
      ) {
        return {
          allowed: true,
          reason: "SUPERVISOR pode acessar vendedores da própria base.",
          targetUser,
        };
      }

      if (currentUser.userId === targetUser.id) {
        return {
          allowed: true,
          reason: "SUPERVISOR pode acessar os próprios dados.",
          targetUser,
        };
      }

      const activeCoverage = await salesCoverageRepository.findActiveCoverage(
        currentUser.userId,
        targetUser.id
      );

      return {
        allowed: !!activeCoverage,
        reason: activeCoverage
          ? "SUPERVISOR pode acessar este supervisor por cobertura ativa."
          : "SUPERVISOR não pode acessar este usuário.",
        targetUser,
      };
    }

    if (currentUser.role === Role.OPERADOR) {
      return {
        allowed: false,
        reason: "OPERADOR não tem acesso a escopo comercial de usuários.",
        targetUser,
      };
    }

    return {
      allowed: false,
      reason: "Acesso não permitido.",
      targetUser,
    };
  },
};