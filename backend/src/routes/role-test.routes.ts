import { Router } from "express";
import { Role } from "@prisma/client";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { ensureRole } from "../middlewares/role.middleware";

const roleTestRoutes = Router();

roleTestRoutes.get(
  "/area-gerente",
  ensureAuthenticated,
  ensureRole(Role.GERENTE),
  (req, res) => {
    return res.status(200).json({
      message: "Acesso liberado para GERENTE.",
      user: req.user,
    });
  }
);

roleTestRoutes.get(
  "/area-supervisao",
  ensureAuthenticated,
  ensureRole(Role.SUPERVISOR, Role.GERENTE),
  (req, res) => {
    return res.status(200).json({
      message: "Acesso liberado para SUPERVISOR ou GERENTE.",
      user: req.user,
    });
  }
);

roleTestRoutes.get(
  "/area-vendedor",
  ensureAuthenticated,
  ensureRole(Role.VENDEDOR),
  (req, res) => {
    return res.status(200).json({
      message: "Acesso liberado para VENDEDOR.",
      user: req.user,
    });
  }
);

roleTestRoutes.get(
  "/area-operador",
  ensureAuthenticated,
  ensureRole(Role.OPERADOR),
  (req, res) => {
    return res.status(200).json({
      message: "Acesso liberado para OPERADOR.",
      user: req.user,
    });
  }
);

export { roleTestRoutes };