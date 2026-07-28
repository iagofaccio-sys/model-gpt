import { Role } from "@prisma/client";
import { AppError } from "../utils/appError";
import { userRepository } from "../repositories/user.repository";
import {
  salesCoverageRepository,
  CreateSalesCoverageData,
} from "../repositories/salesCoverage.repository";

type CreateCoverageInput = {
  substituteId: string;
  coveredUserId: string;
  startDate: string;
  endDate: string;
};

function parseDate(dateString: string, fieldName: string): Date {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    throw new AppError(`Data inválida em ${fieldName}.`, 400);
  }

  return date;
}

function isAllowedCoverageRole(role: Role): boolean {
  return role === Role.VENDEDOR || role === Role.SUPERVISOR;
}

export const salesCoverageService = {
  async create(data: CreateCoverageInput) {
    const substitute = await userRepository.findById(data.substituteId);
    const coveredUser = await userRepository.findById(data.coveredUserId);

    if (!substitute) {
      throw new AppError("Usuário substituto não encontrado.", 404);
    }

    if (!coveredUser) {
      throw new AppError("Usuário coberto não encontrado.", 404);
    }

    if (substitute.id === coveredUser.id) {
      throw new AppError("Um usuário não pode cobrir a si mesmo.", 400);
    }

    if (!isAllowedCoverageRole(substitute.role)) {
      throw new AppError(
        "Somente VENDEDOR e SUPERVISOR podem ser substitutos em cobertura.",
        400
      );
    }

    if (!isAllowedCoverageRole(coveredUser.role)) {
      throw new AppError(
        "Somente VENDEDOR e SUPERVISOR podem ser usuários cobertos em cobertura.",
        400
      );
    }

    if (substitute.role !== coveredUser.role) {
      throw new AppError(
        "A cobertura deve ocorrer entre usuários do mesmo perfil.",
        400
      );
    }

    const startDate = parseDate(data.startDate, "startDate");
    const endDate = parseDate(data.endDate, "endDate");

    if (startDate > endDate) {
      throw new AppError(
        "A data inicial não pode ser maior que a data final.",
        400
      );
    }

    const overlappingForSubstitute =
      await salesCoverageRepository.findOverlappingForSubstitute(
        substitute.id,
        startDate,
        endDate
      );

    if (overlappingForSubstitute) {
      throw new AppError(
        "O substituto já possui outra cobertura ativa nesse período.",
        409
      );
    }

    const overlappingForCoveredUser =
      await salesCoverageRepository.findOverlappingForCoveredUser(
        coveredUser.id,
        startDate,
        endDate
      );

    if (overlappingForCoveredUser) {
      throw new AppError(
        "O usuário coberto já possui outra cobertura ativa nesse período.",
        409
      );
    }

    if (!substitute.baseId || !coveredUser.baseId) {
      throw new AppError(
        "Cobertura exige baseId definido para ambos os usuários.",
        400
      );
    }

    if (substitute.baseId !== coveredUser.baseId) {
      throw new AppError(
        "A cobertura deve ocorrer dentro da mesma base.",
        400
      );
    }

    const coverageData: CreateSalesCoverageData = {
      substituteId: substitute.id,
      coveredUserId: coveredUser.id,
      startDate,
      endDate,
    };

    return salesCoverageRepository.create(coverageData);
  },

  async list() {
    return salesCoverageRepository.findAll();
  },

  async deactivate(id: string) {
    const coverage = await salesCoverageRepository.findById(id);

    if (!coverage) {
      throw new AppError("Cobertura não encontrada.", 404);
    }

    return salesCoverageRepository.deactivate(id);
  },
};