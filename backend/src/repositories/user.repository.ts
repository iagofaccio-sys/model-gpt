import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma";

export type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  baseId?: string;
  supervisorId?: string;
};

export const userRepository = {
  create(data: CreateUserData) {
    return prisma.user.create({ data });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  findAll() {
    return prisma.user.findMany();
  },

  updatePassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  },
};