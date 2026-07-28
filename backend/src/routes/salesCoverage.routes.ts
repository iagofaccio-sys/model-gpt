import { Router } from "express";
import { Role } from "@prisma/client";
import { salesCoverageController } from "../controllers/salesCoverage.controller";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { ensureRole } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createSalesCoverageSchema } from "../schemas/salesCoverage.schema";

const salesCoverageRoutes = Router();

salesCoverageRoutes.post(
  "/sales-coverages",
  ensureAuthenticated,
  ensureRole(Role.GERENTE, Role.SUPERVISOR),
  validate(createSalesCoverageSchema),
  salesCoverageController.create
);

salesCoverageRoutes.get(
  "/sales-coverages",
  ensureAuthenticated,
  ensureRole(Role.GERENTE, Role.SUPERVISOR),
  salesCoverageController.list
);

salesCoverageRoutes.patch(
  "/sales-coverages/:id/deactivate",
  ensureAuthenticated,
  ensureRole(Role.GERENTE, Role.SUPERVISOR),
  salesCoverageController.deactivate
);

export { salesCoverageRoutes };