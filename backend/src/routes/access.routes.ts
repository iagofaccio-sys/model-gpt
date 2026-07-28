import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { accessController } from "../controllers/access.controller";

const accessRoutes = Router();

accessRoutes.get(
  "/users/:id/access-scope",
  ensureAuthenticated,
  accessController.checkUserAccess
);

export { accessRoutes };