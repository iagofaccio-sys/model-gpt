import { prisma } from "../lib/prisma";

export type CreateSalesCoverageData = {
  substituteId: string;
  coveredUserId: string;
  startDate: Date;
  endDate: Date;
};

export const salesCoverageRepository = {
  create(data: CreateSalesCoverageData) {
    return prisma.salesCoverage.create({
      data,
      include: {
        substitute: true,
        coveredUser: true,
      },
    });
  },

  findById(id: string) {
    return prisma.salesCoverage.findUnique({
      where: { id },
      include: {
        substitute: true,
        coveredUser: true,
      },
    });
  },

  findAll() {
    return prisma.salesCoverage.findMany({
      include: {
        substitute: true,
        coveredUser: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });
  },

  findActiveCoverage(substituteId: string, coveredUserId: string, now = new Date()) {
    return prisma.salesCoverage.findFirst({
      where: {
        substituteId,
        coveredUserId,
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });
  },

  findOverlappingForSubstitute(
    substituteId: string,
    startDate: Date,
    endDate: Date
  ) {
    return prisma.salesCoverage.findFirst({
      where: {
        substituteId,
        isActive: true,
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
    });
  },

  findOverlappingForCoveredUser(
    coveredUserId: string,
    startDate: Date,
    endDate: Date
  ) {
    return prisma.salesCoverage.findFirst({
      where: {
        coveredUserId,
        isActive: true,
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
    });
  },

  deactivate(id: string) {
    return prisma.salesCoverage.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  },
};