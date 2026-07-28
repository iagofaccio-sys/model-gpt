import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { userController } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/me", ensureAuthenticated, (req, res) => {
  return res.status(200).json({
    message: "Rota privada acessada com sucesso.",
    user: req.user,
  });
});

userRoutes.get("/users", ensureAuthenticated, userController.listUsers);

export { userRoutes };