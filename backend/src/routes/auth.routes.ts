import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema";

const authRoutes = Router();

authRoutes.post("/signup", validate(signupSchema), authController.signup);
authRoutes.post("/login", validate(loginSchema), authController.login);
authRoutes.post("/logout", authController.logout);
authRoutes.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword
);
authRoutes.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);
authRoutes.post("/refresh-token", authController.refreshToken);

export { authRoutes };